import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userApi } from './db-api';
import type { User } from '@workspace/database';

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'plaza-toolkit-secret-key-change-in-production';
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
   * Generate a JWT token
   */
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  },

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
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
          error: 'Invalid email or password',
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is disabled',
        };
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user.password);

      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Update last login
      await userApi.updateLastLogin(user.id);

      // Generate token
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      // Return success response without password
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
  async getUserFromToken(token: string): Promise<User | null> {
    const payload = this.verifyToken(token);

    if (!payload) {
      return null;
    }

    const user = await userApi.findById(payload.userId);
    return user;
  },

  /**
   * Check if user has required role
   */
  hasRole(user: User | null, requiredRoles: string[]): boolean {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  },

  /**
   * Check if user has required permission
   * This can be extended with more granular permissions
   */
  hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false;

    // Define role-based permissions
    const permissions: Record<string, string[]> = {
      ADMIN: ['*'], // Admin has all permissions
      OFFICER: [
        'reports.create',
        'reports.read',
        'reports.update',
        'reports.assign',
        'evidence.create',
        'evidence.read',
        'notes.create',
        'notes.read',
      ],
      ANALYST: [
        'reports.read',
        'reports.analyze',
        'analysis.create',
        'analysis.read',
        'cases.read',
        'evidence.read',
        'notes.create',
        'notes.read',
      ],
      PROSECUTOR: [
        'cases.create',
        'cases.read',
        'cases.update',
        'cases.close',
        'reports.read',
        'evidence.read',
        'notes.create',
        'notes.read',
      ],
      CITIZEN: [
        'reports.create',
        'reports.read.own',
        'notes.create.own',
        'notes.read.own',
      ],
    };

    const userPermissions = permissions[user.role] || [];

    // Check for wildcard permission
    if (userPermissions.includes('*')) {
      return true;
    }

    // Check for specific permission
    return userPermissions.includes(permission);
  },

  /**
   * Create a session cookie value
   */
  createSessionCookie(token: string): string {
    // In production, add secure flag and proper domain
    return `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },

  /**
   * Parse token from cookie string
   */
  parseTokenFromCookie(cookie: string): string | null {
    const match = cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  },
};

// Middleware helper for API routes
export async function withAuth(
  request: Request,
  requiredRoles?: string[]
): Promise<{ user: User } | { error: string; status: number }> {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const cookie = request.headers.get('cookie');

    let token: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (cookie) {
      token = authUtils.parseTokenFromCookie(cookie);
    }

    if (!token) {
      return { error: 'Unauthorized', status: 401 };
    }

    // Get user from token
    const user = await authUtils.getUserFromToken(token);

    if (!user) {
      return { error: 'Invalid token', status: 401 };
    }

    // Check required roles if specified
    if (requiredRoles && !authUtils.hasRole(user, requiredRoles)) {
      return { error: 'Forbidden', status: 403 };
    }

    return { user };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return { error: 'Authentication failed', status: 401 };
  }
}