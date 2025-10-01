import { NextRequest } from 'next/server';
import { authUtils } from './auth-utils';
import { userApi } from '@workspace/lib/db-api';

export async function withAuth(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return {
      error: 'No authentication token found',
      status: 401
    };
  }

  // Verify token
  const payload = await authUtils.verifyToken(token);

  if (!payload) {
    return {
      error: 'Invalid authentication token',
      status: 401
    };
  }

  // Get fresh user data
  const user = await userApi.findById(payload.userId);

  if (!user) {
    return {
      error: 'User not found',
      status: 404
    };
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword
  };
}