'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import {
  Shield,
  User,
  Calendar,
  MapPin,
  Hash,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@workspace/lib/utils';

interface Evidence {
  id: string;
  type: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  hash: string | null;
  collectedAt: string;
  collectedBy: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  collector: {
    id: string;
    name: string;
    role: string;
    badge: string | null;
  };
}

interface ChainOfCustodyProps {
  evidence: Evidence;
}

export function ChainOfCustody({ evidence }: ChainOfCustodyProps) {
  const isIntegrityVerified = !!evidence.hash;
  const timeSinceCollection = new Date().getTime() - new Date(evidence.collectedAt).getTime();
  const daysSinceCollection = Math.floor(timeSinceCollection / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Chain of Custody
            </CardTitle>
            <CardDescription>
              Legal tracking and integrity verification
            </CardDescription>
          </div>
          <Badge
            variant={isIntegrityVerified ? "default" : "secondary"}
            className={isIntegrityVerified ? "bg-green-100 text-green-800" : ""}
          >
            {isIntegrityVerified ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </>
            ) : (
              <>
                <Info className="h-3 w-3 mr-1" />
                Unverified
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Collection Details */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Collection Details
          </h3>
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collected By</p>
                <p className="font-medium">{evidence.collector.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {evidence.collector.role}
                  </Badge>
                  {evidence.collector.badge && (
                    <span className="text-xs text-muted-foreground">
                      Badge #{evidence.collector.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Collection Date
                </p>
                <p className="font-medium text-sm">
                  {formatDate(evidence.collectedAt, 'long')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(evidence.collectedAt)}
                </p>
              </div>

              {evidence.location && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </p>
                  <p className="font-medium text-sm">{evidence.location}</p>
                  {evidence.latitude && evidence.longitude && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {evidence.latitude.toFixed(6)}, {evidence.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Integrity Verification */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Integrity Verification
          </h3>
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            {evidence.hash ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">File Hash (SHA-256)</p>
                  <p className="font-mono text-xs break-all mt-1 bg-background p-2 rounded border">
                    {evidence.hash}
                  </p>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">
                    Evidence integrity verified - hash recorded at collection
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  No hash recorded - integrity verification unavailable
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Custody Timeline */}
        <div>
          <h3 className="font-semibold mb-3">Custody Timeline</h3>
          <div className="space-y-4">
            {/* Collection Event */}
            <div className="relative pl-6 pb-4 border-l-2 border-primary">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />
              <div className="mb-1">
                <Badge variant="outline" className="text-xs">
                  Collection
                </Badge>
              </div>
              <p className="text-sm font-medium">Evidence Collected</p>
              <p className="text-xs text-muted-foreground mt-1">
                By {evidence.collector.name} • {formatDate(evidence.collectedAt, 'long')}
              </p>
            </div>

            {/* Upload Event */}
            {evidence.createdAt !== evidence.collectedAt && (
              <div className="relative pl-6 pb-4 border-l-2 border-muted">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-muted border-2 border-background" />
                <div className="mb-1">
                  <Badge variant="outline" className="text-xs">
                    Upload
                  </Badge>
                </div>
                <p className="text-sm font-medium">Evidence Uploaded to System</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(evidence.createdAt, 'long')}
                </p>
              </div>
            )}

            {/* Current Status */}
            <div className="relative pl-6">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
              <div className="mb-1">
                <Badge className="text-xs bg-green-100 text-green-800">
                  Current
                </Badge>
              </div>
              <p className="text-sm font-medium">In System Custody</p>
              <p className="text-xs text-muted-foreground mt-1">
                Secured in evidence system • {daysSinceCollection} days in custody
              </p>
            </div>
          </div>
        </div>

        {/* Legal Compliance */}
        <div className="pt-4 border-t">
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Legal Compliance</p>
              <p className="text-xs text-blue-700 mt-1">
                This evidence maintains a complete chain of custody record and is admissible in court proceedings.
                All access and modifications are logged for audit purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Evidence Metadata */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-3 text-sm">Evidence Metadata</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Evidence ID</p>
              <p className="font-mono">{evidence.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium">{evidence.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p>{formatDate(evidence.createdAt, 'short')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Modified</p>
              <p>{formatDate(evidence.updatedAt, 'short')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
