import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/with-auth';
import { prisma } from '@workspace/database/client';
import { UserRole } from '@workspace/database';
import type { ApiResponse } from '@workspace/types/api';

// GET /api/reports/[id]/notes - Get all notes for a report
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;

  try {
    // Check if user has access to the report
    const report = await prisma.report.findUnique({
      where: { id }
    });

    if (!report) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const canAccess =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.ANALYST ||
      user.role === UserRole.PROSECUTOR ||
      (user.role === UserRole.OFFICER && (report.assigneeId === user.id || report.authorId === user.id)) ||
      (user.role === UserRole.CITIZEN && report.authorId === user.id);

    if (!canAccess) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Filter notes based on user role
    const whereClause: any = { reportId: id };

    // Citizens only see public notes (not internal)
    if (user.role === UserRole.CITIZEN) {
      whereClause.isInternal = false;
    }

    const notes = await prisma.note.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: notes },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST /api/reports/[id]/notes - Create a new note
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.content || !body.content.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Note content is required' },
        { status: 400 }
      );
    }

    // Check if user has access to the report
    const report = await prisma.report.findUnique({
      where: { id }
    });

    if (!report) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check permissions to add notes
    const canAddNote =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.ANALYST ||
      (user.role === UserRole.OFFICER && report.assigneeId === user.id);

    if (!canAddNote) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Only assigned officers, analysts, and admins can add notes' },
        { status: 403 }
      );
    }

    // Determine if note is internal (default to true for officers/analysts)
    const isInternal = body.isInternal !== undefined ? body.isInternal : true;

    // Create note
    const note = await prisma.note.create({
      data: {
        content: body.content.trim(),
        type: body.type || 'COMMENT',
        isInternal,
        reportId: id,
        authorId: user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: note },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    );
  }
}
