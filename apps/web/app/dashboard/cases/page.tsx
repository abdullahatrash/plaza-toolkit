'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gavel
} from 'lucide-react';
import { CaseStatus, Priority } from '@workspace/database';
import { formatDate, formatRelativeTime } from '@workspace/lib/utils';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  owner: {
    id: string;
    name: string;
  };
  reportCount: number;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchCases();
  }, [filterStatus, filterPriority, pagination.page]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '20'
      });

      if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPriority && filterPriority !== 'all') params.append('priority', filterPriority);

      const response = await fetch(`/api/cases?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch cases');

      const data = await response.json();
      setCases(data.cases);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case CaseStatus.OPEN:
        return <FileText className="h-4 w-4" />;
      case CaseStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4" />;
      case CaseStatus.WITH_PROSECUTOR:
        return <Gavel className="h-4 w-4" />;
      case CaseStatus.CLOSED:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case CaseStatus.OPEN:
        return 'bg-blue-100 text-blue-700';
      case CaseStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-700';
      case CaseStatus.WITH_PROSECUTOR:
        return 'bg-purple-100 text-purple-700';
      case CaseStatus.CLOSED:
        return 'bg-green-100 text-green-700';
      case CaseStatus.DISMISSED:
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case Priority.CRITICAL:
        return 'destructive';
      case Priority.HIGH:
        return 'default';
      case Priority.MEDIUM:
        return 'secondary';
      case Priority.LOW:
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track investigation cases
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/cases/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases by title, number, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={CaseStatus.OPEN}>Open</SelectItem>
                <SelectItem value={CaseStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={CaseStatus.PENDING_REVIEW}>Pending Review</SelectItem>
                <SelectItem value={CaseStatus.WITH_PROSECUTOR}>With Prosecutor</SelectItem>
                <SelectItem value={CaseStatus.IN_COURT}>In Court</SelectItem>
                <SelectItem value={CaseStatus.CLOSED}>Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value={Priority.CRITICAL}>Critical</SelectItem>
                <SelectItem value={Priority.HIGH}>High</SelectItem>
                <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={Priority.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cases.filter(c => c.status === CaseStatus.OPEN).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cases.filter(c => c.status === CaseStatus.IN_PROGRESS).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cases.filter(c => c.priority === Priority.CRITICAL).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredCases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No cases found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/dashboard/cases/${caseItem.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(caseItem.status)}>
                        {getStatusIcon(caseItem.status)}
                        <span className="ml-1">{caseItem.status.replace('_', ' ')}</span>
                      </Badge>
                      <Badge variant={getPriorityColor(caseItem.priority)}>
                        {caseItem.priority}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {caseItem.caseNumber}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">{caseItem.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {caseItem.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Owner: {caseItem.owner.name}</span>
                    <span>Reports: {caseItem.reportCount}</span>
                    <span>Evidence: {caseItem.evidenceCount}</span>
                  </div>
                  <span>{formatRelativeTime(caseItem.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
