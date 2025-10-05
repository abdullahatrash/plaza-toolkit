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
import {
  Brain,
  FileText,
  BarChart3,
  Shield,
  TrendingUp,
  Activity,
  Map,
  Clock
} from 'lucide-react';

interface AnalystDashboardProps {
  data: any;
  userName: string;
}

export function AnalystDashboard({ data, userName }: AnalystDashboardProps) {
  const router = useRouter();

  return (
    <>
      {/* Welcome Section with Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Analyst Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {userName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => router.push('/dashboard/analysis/new')}>
            <Brain className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/analytics')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/analysis/xai')}>
            <Shield className="h-4 w-4 mr-2" />
            XAI Panel
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/map')}>
            <Map className="h-4 w-4 mr-2" />
            Map View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 mb-8 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Analyses</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.activeAnalyses || 0}
            </CardTitle>
            <CardAction>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">In progress</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.completedAnalyses || 0}
            </CardTitle>
            <CardAction>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">This month</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Reports for Review</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              {data?.assignedReports || 0}
            </CardTitle>
            <CardAction>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Pending analysis</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Cases Involved</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.casesInvolved || 0}
            </CardTitle>
            <CardAction>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Active cases</div>
          </CardFooter>
        </Card>
      </div>

      {/* Analysis Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Queue</CardTitle>
          <CardDescription>Recent and pending AI analysis jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No analysis jobs in queue</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/dashboard/analysis/new')}
            >
              <Brain className="mr-2 h-4 w-4" />
              Start New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
