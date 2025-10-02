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

export function CitizenDashboard({ data, userName }: CitizenDashboardProps) {
  const router = useRouter();

  const reportStats = data?.reportStats || {};
  const byStatus = reportStats.byStatus || {};
  const recent = reportStats.recent || [];

  return (
    <>
      {/* Welcome Banner */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Welcome back, {userName}!
              </h2>
              <p className="text-gray-600 mt-1">
                Track your environmental incident reports and their status
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => router.push('/dashboard/reports/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="mr-2 h-5 w-5" />
              Submit New Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reportStats?.total || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Reports submitted by you</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {(byStatus.SUBMITTED || 0) + (byStatus.UNDER_REVIEW || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Being reviewed by officers</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {byStatus.IN_PROGRESS || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active investigations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {byStatus.RESOLVED || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="mb-6">
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
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reports yet
              </h3>
              <p className="text-gray-500 mb-6">
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
            <div className="space-y-3">
              {recent.slice(0, 5).map((report: any) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getPriorityIcon(report.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {report.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
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
                  <Badge className={getStatusColor(report.status)}>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-6"
              onClick={() => router.push('/dashboard/reports/new')}
            >
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">New Report</div>
                <div className="text-xs text-gray-500 mt-1">
                  Submit an incident
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-6"
              onClick={() => router.push('/dashboard/reports/my')}
            >
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="text-center">
                <div className="font-medium">Track Reports</div>
                <div className="text-xs text-gray-500 mt-1">
                  View your submissions
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-6"
              onClick={() => router.push('/dashboard/map')}
            >
              <Map className="h-8 w-8 text-green-600" />
              <div className="text-center">
                <div className="font-medium">Explore Map</div>
                <div className="text-xs text-gray-500 mt-1">
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
