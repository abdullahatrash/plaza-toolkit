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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Analyst Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {userName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data?.activeAnalyses || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data?.completedAnalyses || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Reports for Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data?.assignedReports || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Pending analysis</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cases Involved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data?.casesInvolved || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active cases</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common analysis tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/analysis/new')}
            >
              <Brain className="h-6 w-6 text-purple-600" />
              <div className="text-center">
                <div className="font-medium">New Analysis</div>
                <div className="text-xs text-gray-500">Run AI analysis</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/analytics')}
            >
              <BarChart3 className="h-6 w-6 text-teal-600" />
              <div className="text-center">
                <div className="font-medium">Analytics</div>
                <div className="text-xs text-gray-500">View insights</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/analysis/xai')}
            >
              <Shield className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">XAI Panel</div>
                <div className="text-xs text-gray-500">Explainability</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={() => router.push('/dashboard/map')}
            >
              <Map className="h-6 w-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">Map View</div>
                <div className="text-xs text-gray-500">Geospatial data</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Queue</CardTitle>
          <CardDescription>Recent and pending AI analysis jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
