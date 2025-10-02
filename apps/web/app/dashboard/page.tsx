"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Brain,
  Clock,
  BarChart3,
  MapPin,
  Camera,
  Calendar,
  Activity,
  Shield,
} from "lucide-react";
import { formatDate, formatRelativeTime } from "@workspace/lib/utils";
import { UserRole, Priority } from "@workspace/database";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch session and populate auth store (always, not just if !user)
      const sessionResponse = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        if (sessionData.success && sessionData.data) {
          // Populate the auth store with user data for TopNav
          useAuthStore.getState().setUser(sessionData.data);
        }
      }

      // Fetch dashboard data (middleware will handle auth)
      const response = await fetch("/api/dashboard", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SUBMITTED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-orange-100 text-orange-800",
      RESOLVED: "bg-green-100 text-green-800",
      DISMISSED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case Priority.CRITICAL:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case Priority.HIGH:
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case Priority.MEDIUM:
        return <Activity className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderOfficerDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              My Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.myReports || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Assigned to Me
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.assignedReports || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.unreadNotifications || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Unread</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.reportStats?.total || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">System-wide</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports by Status */}
      {dashboardData?.reportStats?.byStatus && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reports by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(dashboardData.reportStats.byStatus).map(
                ([status, count]: [string, any]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">
                      {status.replace(/_/g, " ")}
                    </span>
                    <Badge className={getStatusColor(status)}>{count}</Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      {dashboardData?.reportStats?.recent &&
        dashboardData.reportStats.recent.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest reports in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.reportStats.recent.map((report: any) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/reports/${report.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{report.title}</h4>
                        {getPriorityIcon(report.priority)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.location}
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
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Recent Activities */}
      {dashboardData?.recentActivities &&
        dashboardData.recentActivities.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recentActivities.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <Activity className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      {activity.description && (
                        <p className="text-gray-500">{activity.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatRelativeTime(activity.createdAt)}
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

  const renderAnalystDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.activeAnalyses || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.completedAnalyses || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Assigned Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.assignedReports || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">For review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cases Involved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.casesInvolved || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/analysis/new")}
            >
              <Brain className="h-5 w-5" />
              <span className="text-xs">New Analysis</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/reports")}
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs">View Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/analysis/xai")}
            >
              <Shield className="h-5 w-5" />
              <span className="text-xs">XAI Panel</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/analytics")}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderProsecutorDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.activeCases || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">With prosecutor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              In Court
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.inCourtCases || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ongoing trials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.pendingReview || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.upcomingDeadlines?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Court dates</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Court Dates */}
      {dashboardData?.upcomingDeadlines &&
        dashboardData.upcomingDeadlines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Court Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.upcomingDeadlines.map((caseItem: any) => (
                  <div
                    key={caseItem.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/cases/${caseItem.id}`)}
                  >
                    <div>
                      <h4 className="font-medium">{caseItem.title}</h4>
                      <p className="text-sm text-gray-500">
                        Case #{caseItem.caseNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-purple-100 text-purple-800">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(caseItem.courtDate, "short")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </>
  );

  const renderCitizenDashboard = () => {
    const reportStats = dashboardData?.reportStats || {};
    const byStatus = reportStats.byStatus || {};
    const recent = reportStats.recent || [];

    return (
      <>
        {/* Welcome Banner */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-gray-600 mt-1">
                  Track your environmental incident reports and their status
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/reports/new")}>
                <FileText className="mr-2 h-4 w-4" />
                Submit New Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {reportStats?.total || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Reports submitted by you
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Under Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {(byStatus.SUBMITTED || 0) + (byStatus.UNDER_REVIEW || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Being reviewed by officers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {byStatus.IN_PROGRESS || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Active investigations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {byStatus.RESOLVED || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Successfully resolved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Recent Reports</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/reports/my")}
              >
                View All Reports
              </Button>
            </div>
            <CardDescription>
              Track the status of your submitted environmental incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  You haven't submitted any reports yet
                </p>
                <Button onClick={() => router.push("/dashboard/reports/new")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Your First Report
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recent.slice(0, 5).map((report: any) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() =>
                      router.push(`/dashboard/reports/${report.id}`)
                    }
                  >
                    <div className="flex-1">
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
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.replace(/_/g, " ")}
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
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => router.push("/dashboard/reports/new")}
              >
                <FileText className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">New Report</div>
                  <div className="text-xs text-gray-500">
                    Submit an incident
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => router.push("/dashboard/reports/my")}
              >
                <Activity className="h-6 w-6 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium">Track Reports</div>
                  <div className="text-xs text-gray-500">View your reports</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 py-6"
                onClick={() => router.push("/dashboard/map")}
              >
                <MapPin className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Explore Map</div>
                  <div className="text-xs text-gray-500">
                    View incidents map
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {user?.role !== UserRole.CITIZEN && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
      )}
      {user?.role === UserRole.OFFICER && renderOfficerDashboard()}
      {user?.role === UserRole.ANALYST && renderAnalystDashboard()}
      {user?.role === UserRole.PROSECUTOR && renderProsecutorDashboard()}
      {user?.role === UserRole.ADMIN && renderOfficerDashboard()}
      {user?.role === UserRole.CITIZEN && renderCitizenDashboard()}
    </div>
  );
}
