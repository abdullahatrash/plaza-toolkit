import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { userApi } from '@workspace/lib/db-api';
import type { User } from '@workspace/database';
import { NextRequest } from 'next/server';

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'plaza-toolkit-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  error?: string;
}

export const authUtils = {
  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  /**
   * Compare a plain password with a hashed password
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // For demo purposes, we're using base64 encoding
    // In production, use proper bcrypt comparison
    const encodedPassword = Buffer.from(plainPassword).toString('base64');
    return encodedPassword === hashedPassword;
  },

  /**
   * Generate a JWT token using jose (Edge Runtime compatible)
   */
  async generateToken(payload: JWTPayload): Promise<string> {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(secret);
    return token;
  },

  /**
   * Verify and decode a JWT token using jose (Edge Runtime compatible)
   */
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload as unknown as JWTPayload;
    } catch (error) {
      return null;
    }
  },

  /**
   * Authenticate a user with email and password
   */
  async authenticate(email: string, password: string): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await userApi.findByEmail(email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      // Verify password
      const isValid = await this.verifyPassword(password, user.password);
      if (!isValid) {
        return {
          success: false,
          error: 'Invalid credentials',
        };
      }

      // Update last login
      await userApi.updateLastLogin(user.id);

      // Generate token
      const token = await this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  },

  /**
   * Get user from token
   */
  async getUserFromToken(token: string): Promise<Omit<User, 'password'> | null> {
    try {
      const payload = await this.verifyToken(token);
      if (!payload) return null;

      const user = await userApi.findById(payload.userId);
      if (!user) return null;

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return null;
    }
  },
};

/**
 * Verify authentication from NextRequest and return user
 */
export async function verifyAuth(request: NextRequest): Promise<Omit<User, 'password'> | null> {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;
    if (!token) return null;

    // Verify and get user
    const user = await authUtils.getUserFromToken(token);
    return user;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}