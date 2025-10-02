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
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {userName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/users')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.totalUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Active system users</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/reports')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.reportStats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">All incident reports</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/cases')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Briefcase className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.activeCases || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ongoing investigations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <AlertTriangle className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-orange-600">
              {data?.pendingActions || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>System Health</CardTitle>
            </div>
            <CardDescription>Platform status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Operational
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">API Services</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Healthy
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">File Storage</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Available
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle>Quick Stats</CardTitle>
            </div>
            <CardDescription>Last 7 days activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors">
                <span className="text-sm text-muted-foreground">New Reports</span>
                <span className="text-lg font-semibold">{data?.weeklyStats?.newReports || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors">
                <span className="text-sm text-muted-foreground">Cases Created</span>
                <span className="text-lg font-semibold">{data?.weeklyStats?.newCases || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors">
                <span className="text-sm text-muted-foreground">Users Active</span>
                <span className="text-lg font-semibold">{data?.weeklyStats?.activeUsers || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors">
                <span className="text-sm text-muted-foreground">Evidence Uploaded</span>
                <span className="text-lg font-semibold">{data?.weeklyStats?.evidenceCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {data?.recentActivities && data.recentActivities.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <CardTitle>Recent System Activity</CardTitle>
            </div>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.recentActivities.slice(0, 10).map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm p-3 hover:bg-accent/50 rounded-md transition-colors"
                >
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.action}</p>
                    {activity.description && (
                      <p className="text-muted-foreground text-xs mt-1">{activity.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
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
      <Card>
        <CardHeader>
          <CardTitle>Administrative Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/users')}
            >
              <Users className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Manage Users</div>
                <div className="text-xs text-muted-foreground mt-1">User accounts</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/reports')}
            >
              <FileText className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">View Reports</div>
                <div className="text-xs text-muted-foreground mt-1">All reports</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/analytics')}
            >
              <TrendingUp className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Analytics</div>
                <div className="text-xs text-muted-foreground mt-1">System insights</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/settings')}
            >
              <Shield className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Settings</div>
                <div className="text-xs text-muted-foreground mt-1">System config</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
