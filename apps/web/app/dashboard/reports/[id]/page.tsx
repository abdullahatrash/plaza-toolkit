"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FileText,
  Image as ImageIcon,
  Download,
  Edit,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Paperclip,
  Send,
  UserPlus,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { format } from "date-fns";
import { ReportStatus, Priority } from "@workspace/database";
import { toast } from "sonner";

interface ReportDetails {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  incidentDate: string;
  createdAt: string;
  updatedAt: string;
  reporter: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    department: string | null;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    department: string | null;
  } | null;
  evidence: Array<{
    id: string;
    type: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    description: string | null;
    metadata: any;
    uploadedById: string;
    createdAt: string;
  }>;
  updates: Array<{
    id: string;
    content: string;
    type: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
  }>;
  case: {
    id: string;
    title: string;
    status: string;
    priority: string;
  } | null;
}

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateContent, setUpdateContent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${id}`);
      const data = await response.json();

      if (data.success) {
        setReport(data.data);
        setSelectedStatus(data.data.status);
        setSelectedPriority(data.data.priority);
      } else {
        toast.error("Failed to fetch report details");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      Toaster.error("Failed to fetch report details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (response.ok) {
        toast.success("Status updated successfully");
        fetchReport();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      Toaster.error("Failed to update status");
    }
  };

  const handlePriorityUpdate = async () => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: selectedPriority }),
      });

      if (response.ok) {
        toast.success("Priority updated successfully");
        fetchReport();
      } else {
        toast.error("Failed to update priority");
      }
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case ReportStatus.RESOLVED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case ReportStatus.DISMISSED:
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case ReportStatus.IN_PROGRESS:
      case ReportStatus.UNDER_REVIEW:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading report details...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>Report not found</p>
          <Button onClick={() => router.push("/dashboard/reports")} className="mt-4">
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/reports")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{report.title}</h1>
            <p className="text-muted-foreground">
              Report #{report.id.substring(0, 8)}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/dashboard/reports/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Type</p>
                    <Badge variant="secondary">
                      {report.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Priority</p>
                    {getPriorityBadge(report.priority)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Location</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{report.location || "No location specified"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Incident Date</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(report.incidentDate), "PPP")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Reported On</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(report.createdAt), "PPP")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {report.case && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Linked Case</p>
                    <Card className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{report.case.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Case #{report.case.id.substring(0, 8)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(report.case.status)}
                          {getPriorityBadge(report.case.priority)}
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence & Attachments</CardTitle>
              <CardDescription>
                {report.evidence.length} file(s) attached to this report
              </CardDescription>
            </CardHeader>
            <CardContent>
              {report.evidence.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Paperclip className="h-12 w-12 mx-auto mb-2" />
                  <p>No evidence attached to this report</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {report.evidence.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded">
                          {item.type === "IMAGE" ? (
                            <ImageIcon className="h-6 w-6" />
                          ) : (
                            <FileText className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {item.fileName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(item.fileSize / 1024).toFixed(2)} KB
                          </p>
                          {item.description && (
                            <p className="text-sm mt-1">{item.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded {format(new Date(item.createdAt), "PPp")}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity & Updates</CardTitle>
              <CardDescription>
                Timeline of all activities and updates for this report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.updates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                    <p>No updates yet</p>
                  </div>
                ) : (
                  report.updates.map((update) => (
                    <div key={update.id} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={update.user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {update.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {update.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(update.createdAt), "PPp")}
                          </span>
                        </div>
                        <p className="text-sm">{update.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <Textarea
                  placeholder="Add an update or comment..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button disabled={!updateContent.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Post Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>People</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Reporter</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={report.reporter.avatarUrl || undefined} />
                    <AvatarFallback>
                      {report.reporter.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{report.reporter.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.reporter.email}
                    </p>
                    {report.reporter.department && (
                      <p className="text-xs text-muted-foreground">
                        {report.reporter.department}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Assigned To</p>
                {report.assignedTo ? (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={report.assignedTo.avatarUrl || undefined}
                      />
                      <AvatarFallback>
                        {report.assignedTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{report.assignedTo.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.assignedTo.email}
                      </p>
                      {report.assignedTo.department && (
                        <p className="text-xs text-muted-foreground">
                          {report.assignedTo.department}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <UserPlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Not assigned
                    </p>
                    <Button size="sm" className="mt-2">
                      Assign Officer
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                <Button
                  size="sm"
                  className="w-full"
                  disabled={selectedStatus === report.status}
                  onClick={handleStatusUpdate}
                >
                  Update Status
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Update Priority</label>
                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Priority.CRITICAL}>Critical</SelectItem>
                    <SelectItem value={Priority.HIGH}>High</SelectItem>
                    <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={Priority.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={selectedPriority === report.priority}
                  onClick={handlePriorityUpdate}
                >
                  Update Priority
                </Button>
              </div>

              <Separator />

              <Button variant="outline" className="w-full">
                Create Case from Report
              </Button>
              <Button variant="outline" className="w-full">
                Generate Report PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
