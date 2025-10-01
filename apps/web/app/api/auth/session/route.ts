import { NextRequest, NextResponse } from 'next/server';
import { authUtils } from '@/lib/auth-utils';
import { userApi } from '@workspace/lib/db-api';
import type { ApiResponse, SessionUser } from '@workspace/types/api';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;

    console.log('🔑 Session check - Token exists:', !!token);

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'No session found',
        },
        { status: 401 }
      );
    }

    // Verify token
    const payload = await authUtils.verifyToken(token);

    if (!payload) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid session',
        },
        { status: 401 }
      );
    }

    // Get fresh user data from database
    const user = await userApi.findById(payload.userId);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    // Return session user data
    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department || undefined,
      avatarUrl: user.avatarUrl || undefined,
    };

    return NextResponse.json<ApiResponse<SessionUser>>(
      {
        success: true,
        data: sessionUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}