import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/with-auth';
import { prisma } from '@workspace/database/client';
import type { ApiResponse } from '@workspace/types/api';

// GET /api/analysis - Get AI analysis jobs with filters
export async function GET(request: NextRequest) {
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  const { searchParams } = new URL(request.url);

  try {
    const filters: any = {};

    // Parse filters from query params
    const reportId = searchParams.get('reportId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    console.log('📊 Analysis API called with reportId:', reportId);

    if (reportId) filters.reportId = reportId;
    if (status) filters.status = status;
    if (type) filters.type = type;

    // Get analysis jobs with filters
    const analysisJobs = await prisma.analysisJob.findMany({
      where: filters,
      include: {
        report: {
          select: {
            id: true,
            title: true,
            reportNumber: true,
            location: true
          }
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📊 Found', analysisJobs.length, 'analysis jobs for reportId:', reportId);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: analysisJobs
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch analysis jobs' },
      { status: 500 }
    );
  }
}
