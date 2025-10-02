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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Data Analyst Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {userName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Active Analyses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.activeAnalyses || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">In progress</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.completedAnalyses || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Reports for Review</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-orange-600">
              {data?.assignedReports || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Pending analysis</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-sm transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Shield className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Cases Involved</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data?.casesInvolved || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Active cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common analysis tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/analysis/new')}
            >
              <Brain className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">New Analysis</div>
                <div className="text-xs text-muted-foreground mt-1">Run AI analysis</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/analytics')}
            >
              <BarChart3 className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Analytics</div>
                <div className="text-xs text-muted-foreground mt-1">View insights</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/analysis/xai')}
            >
              <Shield className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">XAI Panel</div>
                <div className="text-xs text-muted-foreground mt-1">Explainability</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-8 hover:border-primary transition-all"
              onClick={() => router.push('/dashboard/map')}
            >
              <Map className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">Map View</div>
                <div className="text-xs text-muted-foreground mt-1">Geospatial data</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

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
