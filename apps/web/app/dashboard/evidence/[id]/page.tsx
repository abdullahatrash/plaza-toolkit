'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
  Archive,
  Edit,
  Download,
  MapPin,
  User,
  Calendar,
  FileText,
  Briefcase,
  Hash,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  TestTube,
  MessageSquare
} from 'lucide-react';
import { EvidenceType } from '@workspace/database';
import { formatDate } from '@workspace/lib/utils';

interface EvidenceDetail {
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
    email: string;
  };
  collectedAt: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  report?: {
    id: string;
    reportNumber: string;
    title: string;
    status: string;
  };
  case?: {
    id: string;
    caseNumber: string;
    title: string;
    status: string;
  };
  metadata?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EvidenceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [evidence, setEvidence] = useState<EvidenceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchEvidence(params.id as string);
    }
  }, [params.id]);

  const fetchEvidence = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/evidence/${id}`);
      if (!response.ok) throw new Error('Failed to fetch evidence');

      const data = await response.json();
      setEvidence(data);
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case EvidenceType.PHOTO:
        return <ImageIcon className="h-5 w-5" />;
      case EvidenceType.VIDEO:
        return <Video className="h-5 w-5" />;
      case EvidenceType.DOCUMENT:
        return <FileText className="h-5 w-5" />;
      case EvidenceType.SAMPLE:
        return <TestTube className="h-5 w-5" />;
      case EvidenceType.TESTIMONY:
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <FileIcon className="h-5 w-5" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg">Loading evidence details...</div>
        </div>
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Evidence not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getTypeColor(evidence.type)}>
              {getTypeIcon(evidence.type)}
              <span className="ml-1">{evidence.type}</span>
            </Badge>
            {evidence.hash && (
              <Badge variant="outline" className="font-mono">
                <Hash className="h-3 w-3 mr-1" />
                {evidence.hash}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{evidence.title}</h1>
          {evidence.description && (
            <p className="text-muted-foreground">{evidence.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {evidence.fileUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(evidence.fileUrl, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/evidence/${evidence.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Evidence Preview */}
      {evidence.fileUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Evidence File</CardTitle>
          </CardHeader>
          <CardContent>
            {evidence.type === EvidenceType.PHOTO && (
              <img
                src={evidence.fileUrl}
                alt={evidence.title}
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {evidence.type === EvidenceType.VIDEO && (
              <video
                src={evidence.fileUrl}
                controls
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {evidence.type === EvidenceType.DOCUMENT && (
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">{evidence.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {evidence.fileType} • {formatFileSize(evidence.fileSize)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chain of Custody */}
      <Card>
        <CardHeader>
          <CardTitle>Chain of Custody</CardTitle>
          <CardDescription>Evidence collection and handling information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Collected By</p>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{evidence.collector.name}</p>
                  <p className="text-sm text-muted-foreground">{evidence.collector.email}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Collection Date</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{formatDate(evidence.collectedAt)}</p>
              </div>
            </div>
            {evidence.location && (
              <div>
                <p className="text-sm text-muted-foreground">Collection Location</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{evidence.location}</p>
                </div>
              </div>
            )}
            {(evidence.latitude && evidence.longitude) && (
              <div>
                <p className="text-sm text-muted-foreground">Coordinates</p>
                <p className="font-medium font-mono text-sm">
                  {evidence.latitude.toFixed(6)}, {evidence.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Information */}
      <Card>
        <CardHeader>
          <CardTitle>File Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {evidence.fileType && (
              <div>
                <p className="text-sm text-muted-foreground">File Type</p>
                <p className="font-medium">{evidence.fileType}</p>
              </div>
            )}
            {evidence.fileSize && (
              <div>
                <p className="text-sm text-muted-foreground">File Size</p>
                <p className="font-medium">{formatFileSize(evidence.fileSize)}</p>
              </div>
            )}
            {evidence.hash && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">File Hash (Integrity Verification)</p>
                <p className="font-medium font-mono text-sm break-all">{evidence.hash}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Related Items */}
      {(evidence.report || evidence.case) && (
        <Card>
          <CardHeader>
            <CardTitle>Related Items</CardTitle>
            <CardDescription>Associated reports and cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {evidence.report && (
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => router.push(`/dashboard/reports/${evidence.report!.id}`)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{evidence.report.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {evidence.report.reportNumber}
                    </p>
                  </div>
                  <Badge>{evidence.report.status}</Badge>
                </div>
              </div>
            )}
            {evidence.case && (
              <div
                className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => router.push(`/dashboard/cases/${evidence.case!.id}`)}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{evidence.case.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {evidence.case.caseNumber}
                    </p>
                  </div>
                  <Badge>{evidence.case.status}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Metadata and Tags */}
      {(evidence.metadata || evidence.tags) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {evidence.tags && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(evidence.tags).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            {evidence.metadata && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Metadata</p>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(JSON.parse(evidence.metadata), null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(evidence.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(evidence.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
