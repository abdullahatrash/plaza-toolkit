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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Officer Dashboard</h1>
        <p className="text-gray-600 mt-1">Good day, Officer {userName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/reports/my')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              My Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data?.myReports || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total submitted</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/reports?assigned=me')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Assigned to Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data?.assignedReports || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active assignments</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/cases')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data?.activeCases || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Open investigations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data?.unreadNotifications || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Unread</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports by Status */}
      {data?.reportStats?.byStatus && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reports by Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(data.reportStats.byStatus).map(
                ([status, count]: [string, any]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/reports?status=${status}`)}
                  >
                    <span className="text-sm font-medium">
                      {status.replace(/_/g, ' ')}
                    </span>
                    <Badge className={getStatusColor(status)}>{count}</Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      {data?.reportStats?.recent && data.reportStats.recent.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest reports in the system</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/reports')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.reportStats.recent.slice(0, 5).map((report: any) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(report.priority)}
                      <h4 className="font-medium">{report.title}</h4>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location}
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
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/map')}
            >
              <Map className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">Explore Map</div>
                <div className="text-xs text-gray-500">View incident map</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/reports/new')}
            >
              <FileText className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">New Report</div>
                <div className="text-xs text-gray-500">Submit incident</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/cases')}
            >
              <Briefcase className="h-6 w-6 text-purple-600" />
              <div className="text-center">
                <div className="font-medium">My Cases</div>
                <div className="text-xs text-gray-500">View investigations</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/evidence')}
            >
              <Shield className="h-6 w-6 text-orange-600" />
              <div className="text-center">
                <div className="font-medium">Evidence</div>
                <div className="text-xs text-gray-500">Manage evidence</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {data?.recentActivities && data.recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivities.slice(0, 8).map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Activity className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    {activity.description && (
                      <p className="text-gray-600 mt-0.5">{activity.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
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
