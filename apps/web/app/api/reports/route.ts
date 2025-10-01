import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/with-auth';
import { reportApi } from '@workspace/lib/db-api';
import { UserRole, ReportStatus, Priority } from '@workspace/database';
import type { ApiResponse } from '@workspace/types/api';

// GET /api/reports - Get reports with filters
export async function GET(request: NextRequest) {
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { user } = authResult;
  const { searchParams } = new URL(request.url);

  try {
    const filters: any = {};

    // Parse filters from query params
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const assigneeId = searchParams.get('assigneeId');
    const authorId = searchParams.get('authorId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Apply role-based filtering
    if (user.role === UserRole.OFFICER) {
      // Officers see their assigned reports and public reports
      filters.OR = [
        { assigneeId: user.id },
        { authorId: user.id },
        { status: ReportStatus.SUBMITTED }
      ];
    } else if (user.role === UserRole.CITIZEN) {
      // Citizens only see their own reports
      filters.authorId = user.id;
    }

    // Add specific filters if provided
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (priority) filters.priority = priority;
    if (assigneeId) filters.assigneeId = assigneeId;
    if (authorId) filters.authorId = authorId;

    // Get reports with filters
    const reports = await reportApi.findMany({
      where: filters,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            evidence: true,
            photos: true,
            notes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const total = await reportApi.count({ where: filters });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          reports,
          total,
          limit,
          offset
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
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
    if (!body.title || !body.description || !body.type) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate report number
    const reportNumber = `RPT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create report using db-api method
    const report = await reportApi.create({
      title: body.title,
      description: body.description,
      type: body.type,
      priority: body.priority || Priority.MEDIUM,
      status: ReportStatus.SUBMITTED,
      location: body.location,
      latitude: body.latitude || 0,
      longitude: body.longitude || 0,
      reportNumber,
      author: {
        connect: { id: user.id }
      },
      assignee: body.assigneeId ? {
        connect: { id: body.assigneeId }
      } : undefined,
      incidentDate: body.incidentDate ? new Date(body.incidentDate) : new Date()
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: report },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
