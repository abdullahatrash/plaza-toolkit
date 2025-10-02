'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import {
  Briefcase,
  Edit,
  Users,
  FileText,
  Archive,
  Clock,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { CaseStatus, Priority } from '@workspace/database';
import { formatDate, formatRelativeTime } from '@workspace/lib/utils';

interface CaseDetail {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  summary?: string;
  findings?: string;
  legalStatus?: string;
  courtDate?: string;
  verdict?: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  team: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
  reports: Array<{
    id: string;
    reportNumber: string;
    title: string;
    status: string;
    priority: string;
    author: {
      name: string;
    };
    createdAt: string;
  }>;
  evidence: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    collector: {
      name: string;
    };
    collectedAt: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    type: string;
    isInternal: boolean;
    author: {
      name: string;
    };
    createdAt: string;
  }>;
  activities: Array<{
    id: string;
    type: string;
    action: string;
    description?: string;
    user: {
      name: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCase(params.id as string);
    }
  }, [params.id]);

  const fetchCase = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cases/${id}`);
      if (!response.ok) throw new Error('Failed to fetch case');

      const data = await response.json();
      setCaseData(data);
    } catch (error) {
      console.error('Error fetching case:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg">Loading case details...</div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Case not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getStatusColor(caseData.status)}>
              {caseData.status.replace('_', ' ')}
            </Badge>
            <Badge variant={getPriorityColor(caseData.priority)}>
              {caseData.priority}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {caseData.caseNumber}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{caseData.title}</h1>
          <p className="text-muted-foreground">{caseData.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/cases/${caseData.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owner</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{caseData.owner.name}</div>
            <p className="text-xs text-muted-foreground mt-1">{caseData.owner.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseData.reports.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Linked reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseData.evidence.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Evidence items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caseData.team.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Assigned members</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports ({caseData.reports.length})</TabsTrigger>
          <TabsTrigger value="evidence">Evidence ({caseData.evidence.length})</TabsTrigger>
          <TabsTrigger value="team">Team ({caseData.team.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{caseData.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(caseData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatRelativeTime(caseData.updatedAt)}</p>
                </div>
                {caseData.closedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Closed</p>
                    <p className="font-medium">{formatDate(caseData.closedAt)}</p>
                  </div>
                )}
              </div>
              {caseData.summary && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Summary</p>
                  <p className="text-sm">{caseData.summary}</p>
                </div>
              )}
              {caseData.findings && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Findings</p>
                  <p className="text-sm whitespace-pre-wrap">{caseData.findings}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {(caseData.legalStatus || caseData.courtDate || caseData.verdict) && (
            <Card>
              <CardHeader>
                <CardTitle>Legal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {caseData.legalStatus && (
                    <div>
                      <p className="text-sm text-muted-foreground">Legal Status</p>
                      <p className="font-medium">{caseData.legalStatus}</p>
                    </div>
                  )}
                  {caseData.courtDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Court Date</p>
                      <p className="font-medium">{formatDate(caseData.courtDate)}</p>
                    </div>
                  )}
                </div>
                {caseData.verdict && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Verdict</p>
                    <p className="text-sm">{caseData.verdict}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {caseData.reports.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reports linked to this case</p>
              </CardContent>
            </Card>
          ) : (
            caseData.reports.map((report) => (
              <Card
                key={report.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{report.status}</Badge>
                        <Badge variant="outline">{report.priority}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {report.reportNumber}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>By {report.author.name}</span>
                    <span>{formatRelativeTime(report.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4">
          {caseData.evidence.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No evidence collected for this case</p>
              </CardContent>
            </Card>
          ) : (
            caseData.evidence.map((evidence) => (
              <Card key={evidence.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{evidence.type}</Badge>
                      </div>
                      <CardTitle className="text-lg">{evidence.title}</CardTitle>
                      {evidence.description && (
                        <CardDescription className="mt-2">{evidence.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Collected by {evidence.collector.name}</span>
                    <span>{formatDate(evidence.collectedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{caseData.owner.name}</p>
                  <p className="text-sm text-muted-foreground">{caseData.owner.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {caseData.team.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caseData.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <Badge variant="outline" className="mt-1">{member.role}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {caseData.activities.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {caseData.activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <span>{activity.user.name}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
