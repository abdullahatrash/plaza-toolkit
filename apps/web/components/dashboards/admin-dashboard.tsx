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
      {/* Welcome Section with Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {userName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => router.push('/dashboard/users')}>
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/reports')}>
            <FileText className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/analytics')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/settings')}>
            <Shield className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 mb-8 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/users')}>
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.totalUsers || 0}
            </CardTitle>
            <CardAction>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Active system users</div>
          </CardFooter>
        </Card>

        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/reports')}>
          <CardHeader>
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.reportStats?.total || 0}
            </CardTitle>
            <CardAction>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">All incident reports</div>
          </CardFooter>
        </Card>

        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/cases')}>
          <CardHeader>
            <CardDescription>Active Cases</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.activeCases || 0}
            </CardTitle>
            <CardAction>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Ongoing investigations</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Pending Actions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              {data?.pendingActions || 0}
            </CardTitle>
            <CardAction>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Require attention</div>
          </CardFooter>
        </Card>
      </div>

      {/* System Health and Quick Stats */}
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
        <Card>
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
    </>
  );
}
