import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { userApi } from '@workspace/lib/db-api';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Users can view their own profile, admins can view any
  if (user.id !== id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const userData = await userApi.findById(id, true);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password, ...safeUserData } = userData;
    return NextResponse.json(safeUserData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Users can update their own profile, admins can update any
  if (user.id !== id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, role, badge, department, password } = body;

    // Non-admins cannot change role
    if (user.role !== 'ADMIN' && role) {
      return NextResponse.json(
        { error: 'Only admins can change user roles' },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (badge) updateData.badge = badge;
    if (department) updateData.department = department;
    if (role && user.role === 'ADMIN') updateData.role = role;

    // Handle password change
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userApi.update(id, updateData);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admins can deactivate users
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  // Prevent deactivating self
  if (user.id === id) {
    return NextResponse.json(
      { error: 'Cannot deactivate your own account' },
      { status: 400 }
    );
  }

  try {
    const deactivatedUser = await userApi.deactivate(id);
    return NextResponse.json(deactivatedUser);
  } catch (error) {
    console.error('Error deactivating user:', error);
    return NextResponse.json({ error: 'Failed to deactivate user' }, { status: 500 });
  }
}
