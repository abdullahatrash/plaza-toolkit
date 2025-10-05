'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardAction
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import {
  FileText,
  AlertTriangle,
  MapPin,
  Clock,
  Camera,
  Activity,
  Map,
  Briefcase,
  Shield
} from 'lucide-react';
import { formatRelativeTime } from '@workspace/lib/utils';
import { Priority } from '@workspace/database';
import { StatusBadge } from '@/lib/dashboard-utils';

interface OfficerDashboardProps {
  data: any;
  userName: string;
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case Priority.CRITICAL:
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case Priority.HIGH:
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case Priority.MEDIUM:
      return <Activity className="h-4 w-4 text-yellow-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

export function OfficerDashboard({ data, userName }: OfficerDashboardProps) {
  const router = useRouter();

  return (
    <>
      {/* Welcome Section with Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Officer Dashboard</h1>
          <p className="text-muted-foreground mt-2">Good day, Officer {userName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => router.push('/dashboard/map')}>
            <Map className="h-4 w-4 mr-2" />
            Explore Map
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/cases')}>
            <Briefcase className="h-4 w-4 mr-2" />
            Team Cases
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/evidence')}>
            <Shield className="h-4 w-4 mr-2" />
            Evidence
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 mb-8 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/reports/my')}>
          <CardHeader>
            <CardDescription>My Reports</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.myReports || 0}
            </CardTitle>
            <CardAction>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Total submitted</div>
          </CardFooter>
        </Card>

        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/reports?assigned=me')}>
          <CardHeader>
            <CardDescription>Assigned to Me</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              {data?.assignedReports || 0}
            </CardTitle>
            <CardAction>
              <Briefcase className="h-4 w-4 text-orange-600" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Active assignments</div>
          </CardFooter>
        </Card>

        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/cases')}>
          <CardHeader>
            <CardDescription>Team Cases</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.activeCases || 0}
            </CardTitle>
            <CardAction>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Cases you're supporting</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Notifications</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.unreadNotifications || 0}
            </CardTitle>
            <CardAction>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Unread</div>
          </CardFooter>
        </Card>
      </div>

      {/* Reports by Status */}
      {data?.reportStats?.byStatus && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reports by Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(data.reportStats.byStatus).map(
                ([status, count]: [string, any]) => (
                  <div
                    key={status}
                    className="flex flex-col gap-2 p-3 rounded-md border bg-card hover:bg-accent/50 cursor-pointer transition-all"
                    onClick={() => router.push(`/dashboard/reports?status=${status}`)}
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={status} size="sm" showIcon={false} />
                      <span className="text-xl font-bold">{count}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Reports */}
      {data?.reportStats?.recent && data.reportStats.recent.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Assigned Reports</CardTitle>
                <CardDescription>Reports requiring your attention</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/reports/assigned')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.reportStats.recent.slice(0, 5).map((report: any) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-all"
                  onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0">
                        {getPriorityIcon(report.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{report.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{report.location}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(report.createdAt)}
                          </span>
                          {report.photos?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              {report.photos.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={report.status} size="sm" showIcon={false} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {data?.recentActivities && data.recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.recentActivities.slice(0, 8).map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm p-3 hover:bg-accent/50 rounded-md transition-colors"
                >
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.action}</p>
                    {activity.description && (
                      <p className="text-muted-foreground text-xs mt-1">{activity.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
