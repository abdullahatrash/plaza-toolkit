import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { userApi } from '@workspace/lib/db-api';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admins can activate users
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;

  try {
    const activatedUser = await userApi.activate(id);
    return NextResponse.json(activatedUser);
  } catch (error) {
    console.error('Error activating user:', error);
    return NextResponse.json({ error: 'Failed to activate user' }, { status: 500 });
  }
}
