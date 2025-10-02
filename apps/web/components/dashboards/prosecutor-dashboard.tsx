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
  Briefcase,
  Calendar,
  Gavel,
  FileText,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@workspace/lib/utils';

interface ProsecutorDashboardProps {
  data: any;
  userName: string;
}

export function ProsecutorDashboard({ data, userName }: ProsecutorDashboardProps) {
  const router = useRouter();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prosecutor Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome, Prosecutor {userName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/cases?status=ACTIVE')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {data?.activeCases || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">With prosecutor</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              In Court
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data?.inCourtCases || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ongoing trials</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/cases?status=PENDING_REVIEW')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data?.pendingReview || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/dashboard/cases/calendar')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data?.upcomingDeadlines?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Court dates</p>
          </CardContent>
        </Card>
      </div>

      {data?.upcomingDeadlines && data.upcomingDeadlines.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Upcoming Court Dates
                </CardTitle>
                <CardDescription>Cases with scheduled hearings</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/cases/calendar')}
              >
                View Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.upcomingDeadlines.slice(0, 5).map((caseItem: any) => (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/cases/${caseItem.id}`)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{caseItem.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Case #{caseItem.caseNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(caseItem.courtDate, 'short')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>This Week's Summary</CardTitle>
            <CardDescription>Case activity and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Cases Approved</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {data?.weeklyStats?.casesApproved || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">Cases Closed</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {data?.weeklyStats?.casesClosed || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">New Escalations</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {data?.weeklyStats?.newEscalations || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common prosecutor tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => router.push('/dashboard/cases')}
              >
                <Briefcase className="h-6 w-6 text-indigo-600" />
                <div className="text-center">
                  <div className="font-medium text-sm">View Cases</div>
                  <div className="text-xs text-gray-500">All cases</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => router.push('/dashboard/cases/calendar')}
              >
                <Calendar className="h-6 w-6 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium text-sm">Calendar</div>
                  <div className="text-xs text-gray-500">Court dates</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => router.push('/dashboard/reports')}
              >
                <FileText className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium text-sm">Reports</div>
                  <div className="text-xs text-gray-500">Evidence archive</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => router.push('/dashboard/analytics')}
              >
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium text-sm">Statistics</div>
                  <div className="text-xs text-gray-500">Case metrics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
