import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@workspace/database';
import { verifyAuth } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only analysts and admins can access analytics
    if (user.role !== 'ANALYST' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Analysts and Admins only' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30'; // days

    const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

    // Fetch analytics data
    const [
      totalReports,
      reportsByStatus,
      reportsByType,
      reportsByPriority,
      reportsOverTime,
      topLocations,
      recentActivity,
      totalCases,
      casesByStatus,
      totalEvidence,
      userStats,
      avgResolutionTime
    ] = await Promise.all([
      // Total reports
      prisma.report.count(),

      // Reports by status
      prisma.report.groupBy({
        by: ['status'],
        _count: { id: true }
      }),

      // Reports by type
      prisma.report.groupBy({
        by: ['type'],
        _count: { id: true }
      }),

      // Reports by priority
      prisma.report.groupBy({
        by: ['priority'],
        _count: { id: true }
      }),

      // Reports over time (last N days)
      prisma.$queryRaw<Array<{ date: string; count: number }>>`
        SELECT DATE(createdAt) as date, COUNT(*) as count
        FROM Report
        WHERE createdAt >= ${daysAgo.toISOString()}
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,

      // Top locations (by report count)
      prisma.$queryRaw<Array<{ location: string; count: number }>>`
        SELECT location, COUNT(*) as count
        FROM Report
        GROUP BY location
        ORDER BY count DESC
        LIMIT 10
      `,

      // Recent activity count
      prisma.activity.count({
        where: {
          createdAt: {
            gte: daysAgo
          }
        }
      }),

      // Total cases
      prisma.case.count(),

      // Cases by status
      prisma.case.groupBy({
        by: ['status'],
        _count: { id: true }
      }),

      // Total evidence
      prisma.evidence.count(),

      // User statistics
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true }
      }),

      // Average resolution time (submitted to resolved)
      prisma.$queryRaw<Array<{ avgDays: number }>>`
        SELECT AVG(JULIANDAY(updatedAt) - JULIANDAY(createdAt)) as avgDays
        FROM Report
        WHERE status = 'RESOLVED'
      `
    ]);

    // Calculate trends (compare to previous period)
    const previousPeriodStart = new Date();
    previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(timeRange) * 2);
    const previousPeriodEnd = daysAgo;

    const [currentPeriodCount, previousPeriodCount] = await Promise.all([
      prisma.report.count({
        where: {
          createdAt: {
            gte: daysAgo
          }
        }
      }),
      prisma.report.count({
        where: {
          createdAt: {
            gte: previousPeriodStart,
            lt: previousPeriodEnd
          }
        }
      })
    ]);

    const reportsTrend = previousPeriodCount > 0
      ? ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100
      : 0;

    // Format geographic data - fetch all and filter in memory for type safety
    const allReports = await prisma.report.findMany({
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        type: true,
        status: true,
        priority: true,
        location: true,
        createdAt: true
      },
      take: 1000 // Limit for performance
    });

    // Filter out reports without coordinates
    const geographicData = allReports.filter(
      report => report.latitude !== null && report.longitude !== null
    );

    // Response data
    const analyticsData = {
      summary: {
        totalReports,
        totalCases,
        totalEvidence,
        recentActivity,
        reportsTrend: Math.round(reportsTrend * 10) / 10,
        avgResolutionTime: avgResolutionTime[0]?.avgDays
          ? Math.round(avgResolutionTime[0].avgDays * 10) / 10
          : null
      },
      reportsByStatus: reportsByStatus.map(item => ({
        status: item.status,
        count: item._count.id
      })),
      reportsByType: reportsByType.map(item => ({
        type: item.type,
        count: item._count.id
      })),
      reportsByPriority: reportsByPriority.map(item => ({
        priority: item.priority,
        count: item._count.id
      })),
      reportsOverTime: reportsOverTime.map(item => ({
        date: item.date,
        count: Number(item.count)
      })),
      topLocations: topLocations.map(item => ({
        location: item.location,
        count: Number(item.count)
      })),
      casesByStatus: casesByStatus.map(item => ({
        status: item.status,
        count: item._count.id
      })),
      userStats: userStats.map(item => ({
        role: item.role,
        count: item._count.id
      })),
      geographicData,
      timeRange: parseInt(timeRange),
      generatedAt: now.toISOString()
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
