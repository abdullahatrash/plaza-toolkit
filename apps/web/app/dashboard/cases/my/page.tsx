'use client';

import { useEffect, useState } from 'react';
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
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import {
  Briefcase,
  Calendar,
  Clock,
  Search,
  Filter,
  Gavel,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { CaseStatus, Priority } from '@workspace/database';
import { formatDate, formatRelativeTime } from '@workspace/lib/utils';
import { toast } from 'sonner';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  courtDate: string | null;
  legalStatus: string | null;
  verdict: string | null;
  createdAt: string;
  updatedAt: string;
  owner: {
    name: string;
    role: string;
  };
  reportCount?: number;
  evidenceCount?: number;
  _count?: {
    reports: number;
    evidence: number;
  };
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  [CaseStatus.OPEN]: { label: 'Open', icon: FileText, color: 'bg-blue-100 text-blue-800' },
  [CaseStatus.IN_PROGRESS]: { label: 'In Progress', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  [CaseStatus.PENDING_REVIEW]: { label: 'Pending Review', icon: AlertCircle, color: 'bg-orange-100 text-orange-800' },
  [CaseStatus.WITH_PROSECUTOR]: { label: 'With Prosecutor', icon: Gavel, color: 'bg-purple-100 text-purple-800' },
  [CaseStatus.IN_COURT]: { label: 'In Court', icon: Gavel, color: 'bg-indigo-100 text-indigo-800' },
  [CaseStatus.DISMISSED]: { label: 'Dismissed', icon: XCircle, color: 'bg-red-100 text-red-800' },
  [CaseStatus.CLOSED]: { label: 'Closed', icon: CheckCircle, color: 'bg-gray-100 text-gray-800' }
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  [Priority.LOW]: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  [Priority.MEDIUM]: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  [Priority.HIGH]: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  [Priority.CRITICAL]: { label: 'Critical', color: 'bg-red-100 text-red-800' }
};

const LEGAL_STATUS_OPTIONS = [
  'Under Review',
  'Evidence Collection',
  'Legal Analysis',
  'Filing Prepared',
  'Filed',
  'Pre-Trial',
  'Trial',
  'Sentencing',
  'Appeal',
  'Closed'
];

export default function MyCasesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [legalStatusFilter, setLegalStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');

  useEffect(() => {
    fetchMyCases();
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, searchQuery, statusFilter, priorityFilter, legalStatusFilter, sortBy]);

  const fetchMyCases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cases?assigned=me');

      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }

      const data = await response.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const filterCases = () => {
    let filtered = [...cases];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.caseNumber.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((c) => c.priority === priorityFilter);
    }

    // Legal status filter
    if (legalStatusFilter !== 'all') {
      filtered = filtered.filter((c) => c.legalStatus === legalStatusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'courtDate':
          if (!a.courtDate) return 1;
          if (!b.courtDate) return -1;
          return new Date(a.courtDate).getTime() - new Date(b.courtDate).getTime();
        case 'priority':
          const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        default:
          return 0;
      }
    });

    setFilteredCases(filtered);
  };

  // Calculate stats
  const stats = {
    total: cases.length,
    withProsecutor: cases.filter(c => c.status === CaseStatus.WITH_PROSECUTOR).length,
    inCourt: cases.filter(c => c.status === CaseStatus.IN_COURT).length,
    pendingReview: cases.filter(c => c.status === CaseStatus.PENDING_REVIEW).length,
    upcomingCourtDates: cases.filter(c => c.courtDate && new Date(c.courtDate) > new Date()).length
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Cases</h1>
          <p className="text-muted-foreground mt-2">
            Cases assigned to you for prosecution
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/cases/calendar')}>
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">With Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.withProsecutor}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Court</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">{stats.inCourt}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pendingReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.upcomingCourtDates}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                  <SelectItem key={value} value={value}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={legalStatusFilter} onValueChange={setLegalStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Legal Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Legal Status</SelectItem>
                {LEGAL_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Recently Updated</SelectItem>
                <SelectItem value="createdAt">Recently Created</SelectItem>
                <SelectItem value="courtDate">Court Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">
                {cases.length === 0
                  ? 'No cases assigned to you yet'
                  : 'No cases match your filters'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCases.map((caseItem) => {
            const statusConfig = STATUS_CONFIG[caseItem.status] || STATUS_CONFIG[CaseStatus.OPEN];
            const priorityConfig = PRIORITY_CONFIG[caseItem.priority] || PRIORITY_CONFIG[Priority.MEDIUM];
            const StatusIcon = statusConfig?.icon || FileText;

            return (
              <Card
                key={caseItem.id}
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/cases/${caseItem.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{caseItem.title}</h3>
                        {priorityConfig && (
                          <Badge className={priorityConfig.color}>
                            {priorityConfig.label}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {caseItem.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Case #{caseItem.caseNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {caseItem.reportCount || caseItem._count?.reports || 0} reports
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {caseItem.evidenceCount || caseItem._count?.evidence || 0} evidence
                        </span>
                        {caseItem.courtDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Court: {formatDate(caseItem.courtDate, 'short')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {statusConfig && (
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      )}
                      {caseItem.legalStatus && (
                        <Badge variant="outline" className="text-xs">
                          {caseItem.legalStatus}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Updated {formatRelativeTime(caseItem.updatedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
