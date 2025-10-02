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
  TrendingUp
} from 'lucide-react';
import { formatRelativeTime } from '@workspace/lib/utils';
import { Priority } from '@workspace/database';

interface CitizenDashboardProps {
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

export function CitizenDashboard({ data, userName }: CitizenDashboardProps) {
  const router = useRouter();

  const reportStats = data?.reportStats || {};
  const byStatus = reportStats.byStatus || {};
  const recent = reportStats.recent || [];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground mt-2">
          Track your environmental incident reports and their status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {reportStats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Reports submitted by you</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-yellow-600">
              {(byStatus.SUBMITTED || 0) + (byStatus.UNDER_REVIEW || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Being reviewed by officers</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-orange-600">
              {byStatus.IN_PROGRESS || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Active investigations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-green-600">
              {byStatus.RESOLVED || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Recent Reports</CardTitle>
              <CardDescription>
                Track the status of your submitted environmental incidents
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/reports/my')}
            >
              View All Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                No reports yet
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven't submitted any environmental incident reports yet
              </p>
              <Button
                onClick={() => router.push('/dashboard/reports/new')}
                size="lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Submit Your First Report
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.slice(0, 5).map((report: any) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-all"
                  onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        {getPriorityIcon(report.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {report.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location || 'No location'}
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
                  <Badge variant="secondary" className="text-xs ml-3">
                    {report.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/reports/new')}
            >
              <FileText className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">New Report</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Submit an incident
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/reports/my')}
            >
              <Activity className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Track Reports</div>
                <div className="text-xs text-muted-foreground mt-1">
                  View your submissions
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/map')}
            >
              <Map className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Explore Map</div>
                <div className="text-xs text-muted-foreground mt-1">
                  View incidents map
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
