'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
  Users,
  FileText,
  Briefcase,
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';
import { formatRelativeTime } from '@workspace/lib/utils';

interface AdminDashboardProps {
  data: any;
  userName: string;
}

export function AdminDashboard({ data, userName }: AdminDashboardProps) {
  const router = useRouter();

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System Overview - Welcome back, {userName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/users')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data?.totalUsers || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active system users</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/reports')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data?.reportStats?.total || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">All incident reports</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/cases')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data?.activeCases || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ongoing investigations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data?.pendingActions || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              System Health
            </CardTitle>
            <CardDescription>Platform status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Operational
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">API Services</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Healthy
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">File Storage</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Available
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Quick Stats
            </CardTitle>
            <CardDescription>Last 7 days activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Reports</span>
                <span className="text-lg font-bold text-gray-900">{data?.weeklyStats?.newReports || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cases Created</span>
                <span className="text-lg font-bold text-gray-900">{data?.weeklyStats?.newCases || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Users Active</span>
                <span className="text-lg font-bold text-gray-900">{data?.weeklyStats?.activeUsers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Evidence Uploaded</span>
                <span className="text-lg font-bold text-gray-900">{data?.weeklyStats?.evidenceCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {data?.recentActivities && data.recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Recent System Activity
            </CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivities.slice(0, 10).map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{activity.action}</p>
                    {activity.description && (
                      <p className="text-gray-600 mt-1">{activity.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.user?.name || 'System'} • {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Administrative Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/users')}
            >
              <Users className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">Manage Users</div>
                <div className="text-xs text-gray-500">User accounts</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/reports')}
            >
              <FileText className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">View Reports</div>
                <div className="text-xs text-gray-500">All reports</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/analytics')}
            >
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <div className="text-center">
                <div className="font-medium">Analytics</div>
                <div className="text-xs text-gray-500">System insights</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/settings')}
            >
              <Shield className="h-6 w-6 text-orange-600" />
              <div className="text-center">
                <div className="font-medium">Settings</div>
                <div className="text-xs text-gray-500">System config</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
