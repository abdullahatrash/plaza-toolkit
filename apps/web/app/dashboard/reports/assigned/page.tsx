'use client';

import { useEffect, useState, useRef } from 'react';
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
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  FileText,
  AlertTriangle,
  MapPin,
  Clock,
  Camera,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { formatRelativeTime } from '@workspace/lib/utils';
import { Priority, ReportStatus } from '@workspace/database';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';

interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  status: ReportStatus;
  priority: Priority;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
  photos: any[];
}

const getStatusColor = (status: ReportStatus) => {
  const colors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-orange-100 text-orange-800',
    RESOLVED: 'bg-green-100 text-green-800',
    DISMISSED: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case Priority.CRITICAL:
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case Priority.HIGH:
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case Priority.MEDIUM:
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
};

export default function AssignedReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAssignedReports();
    }
  }, []);

  const fetchAssignedReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports?assigned=me', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned reports');
      }

      const data = await response.json();
      setReports(data.data || []);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort reports
  const filteredReports = reports
    .filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assigned Reports</h1>
        <p className="text-muted-foreground mt-2">
          Manage reports assigned to you for investigation
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, location, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={ReportStatus.UNDER_REVIEW}>Under Review</SelectItem>
                <SelectItem value={ReportStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={ReportStatus.RESOLVED}>Resolved</SelectItem>
                <SelectItem value={ReportStatus.DISMISSED}>Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reports.filter(r => r.status === ReportStatus.UNDER_REVIEW).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reports.filter(r => r.status === ReportStatus.IN_PROGRESS).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === ReportStatus.RESOLVED).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reports ({filteredReports.length})</CardTitle>
              <CardDescription>
                Click a report to view details and take action
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No reports have been assigned to you yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-accent/50 cursor-pointer transition-all"
                  onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(report.priority)}
                      <h4 className="font-semibold truncate">{report.title}</h4>
                      <Badge
                        className={`ml-2 text-xs ${getStatusColor(report.status)}`}
                      >
                        {report.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{report.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(report.createdAt)}
                      </span>
                      {report.photos?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          {report.photos.length} photo{report.photos.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reporter: {report.author.name}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
