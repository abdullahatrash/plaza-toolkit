"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Plus, Search, Download, Eye, Edit } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { format } from "date-fns";
import { ReportType, ReportStatus, Priority } from "@workspace/database";
import { toast } from "sonner";

interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  location: string | null;
  incidentDate: string;
  createdAt: string;
  reportNumber: string;
  _count: {
    photos: number;
    evidence: number;
  };
}

export default function MyReportsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    if (user?.id) {
      fetchMyReports();
    }
  }, [user?.id, statusFilter, typeFilter]);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("authorId", user?.id || "");
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);

      const response = await fetch(`/api/reports?${params.toString()}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setReports(data.data.reports);
      } else {
        toast.error("Failed to fetch your reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch your reports");
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      [ReportStatus.SUBMITTED]: "bg-blue-100 text-blue-800",
      [ReportStatus.UNDER_REVIEW]: "bg-yellow-100 text-yellow-800",
      [ReportStatus.IN_PROGRESS]: "bg-orange-100 text-orange-800",
      [ReportStatus.RESOLVED]: "bg-green-100 text-green-800",
      [ReportStatus.DISMISSED]: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      [Priority.CRITICAL]: "bg-red-100 text-red-800",
      [Priority.HIGH]: "bg-orange-100 text-orange-800",
      [Priority.MEDIUM]: "bg-yellow-100 text-yellow-800",
      [Priority.LOW]: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={colors[priority] || "bg-gray-100 text-gray-800"}>
        {priority}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      [ReportType.POLLUTION]: "bg-purple-100 text-purple-800",
      [ReportType.WILDLIFE]: "bg-green-100 text-green-800",
      [ReportType.DEFORESTATION]: "bg-orange-100 text-orange-800",
      [ReportType.WATER_QUALITY]: "bg-blue-100 text-blue-800",
      [ReportType.AIR_QUALITY]: "bg-cyan-100 text-cyan-800",
      [ReportType.NOISE]: "bg-yellow-100 text-yellow-800",
      [ReportType.WASTE]: "bg-red-100 text-red-800",
      [ReportType.OTHER]: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>
        {type.replace("_", " ")}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Report Number",
      "Title",
      "Type",
      "Status",
      "Priority",
      "Created Date",
      "Location",
    ];
    const csvData = filteredReports.map((report) => [
      report.reportNumber,
      report.title,
      report.type.replace("_", " "),
      report.status.replace("_", " "),
      report.priority,
      format(new Date(report.createdAt), "MMM dd, yyyy"),
      report.location || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-reports-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Reports exported successfully");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-gray-600 mt-1">
            Showing {filteredReports.length} of {reports.length} reports
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/reports/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-hidden">
          <div className="flex flex-col gap-4 mb-6 w-full">
            <div className="flex flex-wrap gap-4 w-full">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search your reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={ReportStatus.SUBMITTED}>
                    Submitted
                  </SelectItem>
                  <SelectItem value={ReportStatus.UNDER_REVIEW}>
                    Under Review
                  </SelectItem>
                  <SelectItem value={ReportStatus.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={ReportStatus.RESOLVED}>
                    Resolved
                  </SelectItem>
                  <SelectItem value={ReportStatus.DISMISSED}>
                    Dismissed
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={ReportType.POLLUTION}>
                    Pollution
                  </SelectItem>
                  <SelectItem value={ReportType.WILDLIFE}>Wildlife</SelectItem>
                  <SelectItem value={ReportType.DEFORESTATION}>
                    Deforestation
                  </SelectItem>
                  <SelectItem value={ReportType.WATER_QUALITY}>
                    Water Quality
                  </SelectItem>
                  <SelectItem value={ReportType.AIR_QUALITY}>
                    Air Quality
                  </SelectItem>
                  <SelectItem value={ReportType.NOISE}>Noise</SelectItem>
                  <SelectItem value={ReportType.WASTE}>Waste</SelectItem>
                  <SelectItem value={ReportType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={exportToCSV}
                title="Export to CSV"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    Report Number
                  </TableHead>
                  <TableHead className="whitespace-nowrap min-w-[200px]">
                    Title
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Type</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Priority</TableHead>
                  <TableHead className="whitespace-nowrap">Location</TableHead>
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Attachments
                  </TableHead>
                  <TableHead className="text-right whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading your reports...
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-500">No reports found</p>
                        <Button
                          size="sm"
                          onClick={() => router.push("/dashboard/reports/new")}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Report
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow
                      key={report.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(`/dashboard/reports/${report.id}`)
                      }
                    >
                      <TableCell className="font-medium whitespace-nowrap">
                        {report.reportNumber}
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[200px] max-w-[300px]">
                          <p className="font-medium truncate">{report.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {report.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getTypeBadge(report.type)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getStatusBadge(report.status)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getPriorityBadge(report.priority)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="text-sm">
                          {report.location || "No location"}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="text-sm">
                          {format(
                            new Date(report.incidentDate),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex gap-2 text-sm">
                          <span>{report._count.photos} photos</span>
                          <span className="text-muted-foreground">|</span>
                          <span>{report._count.evidence} files</span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/reports/${report.id}`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/reports/${report.id}/edit`
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
