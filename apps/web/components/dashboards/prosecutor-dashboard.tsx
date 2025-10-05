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
      {/* Welcome Section with Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prosecutor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome, Prosecutor {userName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => router.push('/dashboard/cases')}>
            <Briefcase className="h-4 w-4 mr-2" />
            View Cases
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/cases/calendar')}>
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/reports')}>
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/analytics')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Statistics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 mb-8 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/cases?status=ACTIVE')}>
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
            <div className="text-muted-foreground">With prosecutor</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>In Court</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.inCourtCases || 0}
            </CardTitle>
            <CardAction>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Ongoing trials</div>
          </CardFooter>
        </Card>

        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/cases?status=PENDING_REVIEW')}>
          <CardHeader>
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              {data?.pendingReview || 0}
            </CardTitle>
            <CardAction>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Need attention</div>
          </CardFooter>
        </Card>

        <Card className="@container/card cursor-pointer" onClick={() => router.push('/dashboard/cases/calendar')}>
          <CardHeader>
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.upcomingDeadlines?.length || 0}
            </CardTitle>
            <CardAction>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Court dates</div>
          </CardFooter>
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

      {/* Weekly Summary */}
      <Card className="mb-8">
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
    </>
  );
}
