import { NextRequest, NextResponse } from 'next/server';
import { authUtils } from '@/lib/auth-utils';
import { loginSchema } from '@workspace/types/forms';
import type { ApiResponse, LoginResponse } from '@workspace/types/api';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    // Authenticate user
    const result = await authUtils.authenticate(
      validation.data.email,
      validation.data.password
    );

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: result.error || 'Authentication failed',
        },
        { status: 401 }
      );
    }

    // Create response with session cookie
    const response = NextResponse.json<ApiResponse<LoginResponse>>(
      {
        success: true,
        data: {
          user: result.user!,
          token: result.token!,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('✅ Login successful - Cookie set for user:', result.user!.email);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}