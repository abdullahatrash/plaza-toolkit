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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Prosecutor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome, Prosecutor {userName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/cases?status=ACTIVE')}>
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
            <p className="text-xs text-muted-foreground mt-2">With prosecutor</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Gavel className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">In Court</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.inCourtCases || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Ongoing trials</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/cases?status=PENDING_REVIEW')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-orange-600">
              {data?.pendingReview || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Need attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all cursor-pointer" onClick={() => router.push('/dashboard/cases/calendar')}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.upcomingDeadlines?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Court dates</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Court Dates */}
      {data?.upcomingDeadlines && data.upcomingDeadlines.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
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
            <div className="space-y-2">
              {data.upcomingDeadlines.slice(0, 5).map((caseItem: any) => (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-all"
                  onClick={() => router.push(`/dashboard/cases/${caseItem.id}`)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{caseItem.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Case #{caseItem.caseNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
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

      {/* Weekly Summary and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>This Week's Summary</CardTitle>
            <CardDescription>Case activity and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-all">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Cases Approved</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {data?.weeklyStats?.casesApproved || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-all">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">Cases Closed</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {data?.weeklyStats?.casesClosed || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-all">
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
                className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
                onClick={() => router.push('/dashboard/cases')}
              >
                <Briefcase className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">View Cases</div>
                  <div className="text-xs text-muted-foreground mt-1">All cases</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
                onClick={() => router.push('/dashboard/cases/calendar')}
              >
                <Calendar className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Calendar</div>
                  <div className="text-xs text-muted-foreground mt-1">Court dates</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
                onClick={() => router.push('/dashboard/reports')}
              >
                <FileText className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Reports</div>
                  <div className="text-xs text-muted-foreground mt-1">Evidence archive</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
                onClick={() => router.push('/dashboard/analytics')}
              >
                <TrendingUp className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Statistics</div>
                  <div className="text-xs text-muted-foreground mt-1">Case metrics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
