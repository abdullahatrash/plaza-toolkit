import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { userApi } from '@workspace/lib/db-api';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || undefined;
  const isActive = searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Analysts can only fetch officers for assignment
  if (user.role === 'ANALYST') {
    if (role && role !== 'OFFICER') {
      return NextResponse.json({ error: 'Analysts can only fetch officers' }, { status: 403 });
    }

    try {
      const result = await userApi.list(
        { role: 'OFFICER', isActive: true, search },
        { page, limit }
      );
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error fetching officers:', error);
      return NextResponse.json({ error: 'Failed to fetch officers' }, { status: 500 });
    }
  }

  // Only admins can list all users
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const result = await userApi.list(
      { role, isActive, search },
      { page, limit }
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admins can create users
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, name, password, role, badge, department } = body;

    // Validate required fields
    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: 'Email, name, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userApi.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await userApi.create({
      email,
      name,
      password: hashedPassword,
      role,
      badge,
      department,
      isActive: true
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
