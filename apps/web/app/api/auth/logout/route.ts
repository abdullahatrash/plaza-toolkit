import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@workspace/types/api';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    // Clear the session cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: false, // Set to false for HTTP access (change to true when using HTTPS)
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}