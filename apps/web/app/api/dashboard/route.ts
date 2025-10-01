import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/with-auth';
import { dashboardApi, reportApi } from '@workspace/lib/db-api';
import { UserRole } from '@workspace/database';
import type { ApiResponse, DashboardStats, OfficerDashboard, AnalystDashboard, ProsecutorDashboard } from '@workspace/types/api';

export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await withAuth(request);

  if ('error' in authResult) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: authResult.error,
      },
      { status: authResult.status }
    );
  }

  const { user } = authResult;

  try {
    let dashboardData: any = {};

    // Get role-specific dashboard data
    switch (user.role) {
      case UserRole.OFFICER:
        const officerStats = await dashboardApi.getOfficerStats(user.id);
        const reportStats = await reportApi.getStats(user.id, UserRole.OFFICER);

        dashboardData = {
          ...officerStats,
          reportStats,
          role: UserRole.OFFICER
        };
        break;

      case UserRole.ANALYST:
        const analystStats = await dashboardApi.getAnalystStats(user.id);
        const analystReportStats = await reportApi.getStats(user.id, UserRole.ANALYST);

        dashboardData = {
          ...analystStats,
          reportStats: analystReportStats,
          role: UserRole.ANALYST
        };
        break;

      case UserRole.PROSECUTOR:
        const prosecutorStats = await dashboardApi.getProsecutorStats(user.id);

        dashboardData = {
          ...prosecutorStats,
          role: UserRole.PROSECUTOR
        };
        break;

      case UserRole.ADMIN:
        // Admin sees overall system stats
        const overallStats = await reportApi.getStats();

        dashboardData = {
          ...overallStats,
          role: UserRole.ADMIN
        };
        break;

      case UserRole.CITIZEN:
        // Citizen sees their own reports
        const citizenStats = await reportApi.getStats(user.id, UserRole.CITIZEN);

        dashboardData = {
          ...citizenStats,
          role: UserRole.CITIZEN
        };
        break;

      default:
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Invalid user role',
          },
          { status: 400 }
        );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: dashboardData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
      },
      { status: 500 }
    );
  }
}