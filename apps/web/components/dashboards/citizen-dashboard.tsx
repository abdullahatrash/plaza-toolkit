"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
  CardAction,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  FileText,
  AlertTriangle,
  MapPin,
  Clock,
  Camera,
  Activity,
  Map,
  TrendingUp,
} from "lucide-react";
import { formatRelativeTime } from "@workspace/lib/utils";
import { Priority } from "@workspace/database";

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
      {/* Welcome Section with Action Buttons */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your environmental incident reports and their status
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => router.push("/dashboard/reports/new")}>
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/reports/my")}
          >
            <Activity className="h-4 w-4 mr-2" />
            My Reports
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/map")}
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 mb-8 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {reportStats?.total || 0}
            </CardTitle>
            <CardAction>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Reports submitted by you
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-yellow-600">
              {(byStatus.SUBMITTED || 0) + (byStatus.UNDER_REVIEW || 0)}
            </CardTitle>
            <CardAction>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Being reviewed by officers
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              {byStatus.IN_PROGRESS || 0}
            </CardTitle>
            <CardAction>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Active investigations</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Resolved</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
              {byStatus.RESOLVED || 0}
            </CardTitle>
            <CardAction>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">Successfully resolved</div>
          </CardFooter>
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
              onClick={() => router.push("/dashboard/reports/my")}
            >
              View All Reports
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No reports yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't submitted any environmental incident reports yet
              </p>
              <Button
                onClick={() => router.push("/dashboard/reports/new")}
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
                        <h4 className="font-medium truncate">{report.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location || "No location"}
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
                    {report.status.replace(/_/g, " ")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
