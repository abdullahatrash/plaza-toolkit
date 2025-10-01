import { jwtVerify } from 'jose';

// JWT secret - must match the one in lib package
const JWT_SECRET = process.env.JWT_SECRET || 'plaza-toolkit-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

/**
 * Verify and decode a JWT token for middleware use (Edge Runtime compatible)
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}