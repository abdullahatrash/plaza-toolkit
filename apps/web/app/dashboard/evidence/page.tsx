'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import {
  Archive,
  Plus,
  Search,
  Filter,
  FileText,
  Video,
  Image,
  File,
  TestTube,
  MessageSquare,
  Download
} from 'lucide-react';
import { EvidenceType } from '@workspace/database';
import { formatDate, formatRelativeTime } from '@workspace/lib/utils';

interface Evidence {
  id: string;
  type: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  hash?: string;
  collector: {
    id: string;
    name: string;
  };
  report?: {
    id: string;
    reportNumber: string;
    title: string;
  };
  case?: {
    id: string;
    caseNumber: string;
    title: string;
  };
  collectedAt: string;
  location?: string;
  createdAt: string;
}

export default function EvidencePage() {
  const router = useRouter();
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchEvidence();
  }, [filterType, pagination.page]);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '20'
      });

      if (filterType && filterType !== 'all') params.append('type', filterType);

      const response = await fetch(`/api/evidence?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch evidence');

      const data = await response.json();
      setEvidence(data.evidence);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvidence = evidence.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.collector.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case EvidenceType.PHOTO:
        return <Image className="h-4 w-4" />;
      case EvidenceType.VIDEO:
        return <Video className="h-4 w-4" />;
      case EvidenceType.DOCUMENT:
        return <FileText className="h-4 w-4" />;
      case EvidenceType.SAMPLE:
        return <TestTube className="h-4 w-4" />;
      case EvidenceType.TESTIMONY:
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case EvidenceType.PHOTO:
        return 'bg-blue-100 text-blue-700';
      case EvidenceType.VIDEO:
        return 'bg-purple-100 text-purple-700';
      case EvidenceType.DOCUMENT:
        return 'bg-green-100 text-green-700';
      case EvidenceType.SAMPLE:
        return 'bg-yellow-100 text-yellow-700';
      case EvidenceType.TESTIMONY:
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evidence</h1>
          <p className="text-muted-foreground mt-1">
            Manage evidence collection and chain of custody
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/evidence/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Evidence
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search evidence by title, description, or collector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={EvidenceType.PHOTO}>Photo</SelectItem>
                <SelectItem value={EvidenceType.VIDEO}>Video</SelectItem>
                <SelectItem value={EvidenceType.DOCUMENT}>Document</SelectItem>
                <SelectItem value={EvidenceType.SAMPLE}>Sample</SelectItem>
                <SelectItem value={EvidenceType.TESTIMONY}>Testimony</SelectItem>
                <SelectItem value={EvidenceType.REPORT}>Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Photos</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evidence.filter(e => e.type === EvidenceType.PHOTO).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evidence.filter(e => e.type === EvidenceType.DOCUMENT).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Samples</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {evidence.filter(e => e.type === EvidenceType.SAMPLE).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredEvidence.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No evidence found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredEvidence.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/dashboard/evidence/${item.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)}
                        <span className="ml-1">{item.type}</span>
                      </Badge>
                      {item.hash && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {item.hash.substring(0, 8)}...
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                    {item.description && (
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </div>
                  {item.fileUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.fileUrl, '_blank');
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Collected by {item.collector.name}</span>
                    <span>{formatDate(item.collectedAt)}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-2">
                      <span>Location: {item.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {item.report && (
                      <span>Report: {item.report.reportNumber}</span>
                    )}
                    {item.case && (
                      <span>Case: {item.case.caseNumber}</span>
                    )}
                    {item.fileSize && (
                      <span>Size: {formatFileSize(item.fileSize)}</span>
                    )}
                  </div>
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
