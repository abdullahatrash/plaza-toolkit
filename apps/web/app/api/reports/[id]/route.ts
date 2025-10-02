import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/with-auth';
import { reportApi, notificationApi } from '@workspace/lib/db-api';
import { prisma } from '@workspace/database/client';
import { UserRole, NotificationType, ReportStatus } from '@workspace/database';
import type { ApiResponse } from '@workspace/types/api';

// GET /api/reports/[id] - Get a single report
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
    const report = await reportApi.findById(id);

    if (!report) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check access permissions
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

    // Get full report details
    const fullReport = await reportApi.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            department: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            department: true
          }
        },
        photos: {
          orderBy: { createdAt: 'desc' }
        },
        notes: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        evidence: {
          orderBy: { createdAt: 'desc' }
        },
        case: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true
          }
        }
      }
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: fullReport },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

// PATCH /api/reports/[id] - Update a report
export async function PATCH(
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
    const report = await reportApi.findById(id);

    if (!report) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Check update permissions
    const canUpdate =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.ANALYST ||
      (user.role === UserRole.OFFICER && report.assigneeId === user.id) ||
      (user.role === UserRole.CITIZEN && report.authorId === user.id);

    if (!canUpdate) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Citizens can only update certain fields
    let updateData: any = body;
    if (user.role === UserRole.CITIZEN) {
      const allowedFields = ['title', 'description', 'location'];
      const updates: any = {};
      for (const field of allowedFields) {
        if (field in body) {
          updates[field] = body[field];
        }
      }
      updateData = updates;
    }

    // Check if status or assignment is being updated (to send notification)
    const statusChanged = updateData.status && updateData.status !== report.status;
    const assigneeChanged = updateData.assigneeId && updateData.assigneeId !== report.assigneeId;
    const oldStatus = report.status;

    // Update report
    const updatedReport = await reportApi.update({
      where: { id },
      data: updateData,
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
        }
      }
    });

    // Create a note if status changed and a note was provided
    if (statusChanged && body.note) {
      try {
        await prisma.note.create({
          data: {
            content: body.note,
            type: 'UPDATE',
            isInternal: true,
            reportId: id,
            authorId: user.id
          }
        });
      } catch (error) {
        console.error('Failed to create note:', error);
        // Don't fail the request if note creation fails
      }
    }

    // Send notification to report author (citizen) if status changed
    if (statusChanged && report.authorId !== user.id) {
      const statusMessages: Record<string, { title: string; message: string; type: string }> = {
        [ReportStatus.UNDER_REVIEW]: {
          title: 'Report Under Review',
          message: `Your report "${report.title}" is now being reviewed by our team.`,
          type: NotificationType.INFO
        },
        [ReportStatus.IN_PROGRESS]: {
          title: 'Investigation Started',
          message: `Investigation has started on your report "${report.title}". An officer has been assigned.`,
          type: NotificationType.INFO
        },
        [ReportStatus.RESOLVED]: {
          title: 'Report Resolved',
          message: `Your report "${report.title}" has been resolved. Thank you for your contribution!`,
          type: NotificationType.SUCCESS
        },
        [ReportStatus.DISMISSED]: {
          title: 'Report Status Updated',
          message: `Your report "${report.title}" has been reviewed and dismissed.`,
          type: NotificationType.WARNING
        }
      };

      const statusUpdate = statusMessages[updateData.status];
      if (statusUpdate) {
        try {
          await notificationApi.create({
            type: statusUpdate.type,
            title: statusUpdate.title,
            message: statusUpdate.message,
            link: `/dashboard/reports/${id}`,
            userId: report.authorId
          });
        } catch (error) {
          console.error('Failed to create notification:', error);
          // Don't fail the request if notification fails
        }
      }
    }

    // Send notification to report author if officer is assigned
    if (assigneeChanged && report.authorId !== user.id && updateData.assigneeId) {
      try {
        await notificationApi.create({
          type: NotificationType.ASSIGNMENT,
          title: 'Officer Assigned',
          message: `An officer has been assigned to investigate your report "${report.title}".`,
          link: `/dashboard/reports/${id}`,
          userId: report.authorId
        });
      } catch (error) {
        console.error('Failed to create assignment notification:', error);
      }
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: updatedReport },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

// DELETE /api/reports/[id] - Delete a report
export async function DELETE(
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

  // Only admins can delete reports
  if (user.role !== UserRole.ADMIN) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Access denied' },
      { status: 403 }
    );
  }

  try {
    const report = await reportApi.findById(id);

    if (!report) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    // Delete report and related data
    await reportApi.delete({
      where: { id }
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: { message: 'Report deleted successfully' } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete report error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}