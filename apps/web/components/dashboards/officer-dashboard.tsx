'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
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

interface OfficerDashboardProps {
  data: any;
  userName: string;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-orange-100 text-orange-800',
    RESOLVED: 'bg-green-100 text-green-800',
    DISMISSED: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Officer Dashboard</h1>
        <p className="text-muted-foreground mt-2">Good day, Officer {userName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/reports/my')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">My Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.myReports || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total submitted</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/reports?assigned=me')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Briefcase className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Assigned to Me</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-orange-600">
              {data?.assignedReports || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Active assignments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/cases')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Shield className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.activeCases || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Open investigations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.unreadNotifications || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Unread</p>
          </CardContent>
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
                    className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 cursor-pointer transition-all"
                    onClick={() => router.push(`/dashboard/reports?status=${status}`)}
                  >
                    <span className="text-sm font-medium">
                      {status.replace(/_/g, ' ')}
                    </span>
                    <Badge variant="secondary" className="text-xs">{count}</Badge>
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
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(report.priority)}
                      <h4 className="font-medium truncate">{report.title}</h4>
                    </div>
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
                  <Badge
                    className={`ml-3 text-xs ${getStatusColor(report.status)}`}
                  >
                    {report.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/map')}
            >
              <Map className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Explore Map</div>
                <div className="text-xs text-muted-foreground mt-1">View incident map</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/reports/new')}
            >
              <FileText className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">New Report</div>
                <div className="text-xs text-muted-foreground mt-1">Submit incident</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/cases')}
            >
              <Briefcase className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">My Cases</div>
                <div className="text-xs text-muted-foreground mt-1">View investigations</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/evidence')}
            >
              <Shield className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Evidence</div>
                <div className="text-xs text-muted-foreground mt-1">Manage evidence</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {data?.recentActivities && data.recentActivities.length > 0 && (
        <Card className="mt-8">
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
