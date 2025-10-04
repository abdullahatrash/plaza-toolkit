'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Archive, Upload, Loader2 } from 'lucide-react';
import { EvidenceType } from '@workspace/database';
import { toast } from 'sonner';

export default function NewEvidencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    type: EvidenceType.PHOTO,
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    reportId: '',
    caseId: '',
    tags: '',
    collectedAt: new Date().toISOString().slice(0, 16)
  });
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      let fileUrl = '';
      let fileType = '';
      let fileSize = 0;
      let hash = '';

      // Upload file if provided
      if (file) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('type', 'evidence');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'File upload failed');
        }

        const uploadResult = await uploadResponse.json();
        const uploadData = uploadResult.data || uploadResult; // Handle both formats
        fileUrl = uploadData.url;
        fileType = file.type;
        fileSize = file.size;
        hash = uploadData.hash || '';
        setUploading(false);
      }

      // Create evidence record
      const evidenceData = {
        type: formData.type,
        title: formData.title,
        description: formData.description || undefined,
        fileUrl: fileUrl || undefined,
        fileType: fileType || undefined,
        fileSize: fileSize || undefined,
        hash: hash || undefined,
        location: formData.location || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        collectedAt: formData.collectedAt,
        reportId: formData.reportId || undefined,
        caseId: formData.caseId || undefined,
        tags: formData.tags ? JSON.stringify(formData.tags.split(',').map(t => t.trim())) : undefined
      };

      const response = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evidenceData)
      });

      if (!response.ok) {
        throw new Error('Failed to create evidence');
      }

      const result = await response.json();
      toast.success('Evidence created successfully');
      router.push(`/dashboard/evidence/${result.id}`);
    } catch (error) {
      console.error('Error creating evidence:', error);
      toast.error('Failed to create evidence');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Evidence</h1>
        <p className="text-muted-foreground mt-1">
          Document and upload evidence with chain of custody
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Evidence Information</CardTitle>
            <CardDescription>Enter the details of the evidence being collected</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Evidence Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as typeof EvidenceType[keyof typeof EvidenceType] })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EvidenceType.PHOTO}>Photo</SelectItem>
                  <SelectItem value={EvidenceType.VIDEO}>Video</SelectItem>
                  <SelectItem value={EvidenceType.DOCUMENT}>Document</SelectItem>
                  <SelectItem value={EvidenceType.SAMPLE}>Physical Sample</SelectItem>
                  <SelectItem value={EvidenceType.TESTIMONY}>Testimony</SelectItem>
                  <SelectItem value={EvidenceType.REPORT}>Report</SelectItem>
                  <SelectItem value={EvidenceType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Water sample from contaminated site"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the evidence..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="max-w-xs mx-auto"
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            {/* Collection Date/Time */}
            <div className="space-y-2">
              <Label htmlFor="collectedAt">Collection Date & Time</Label>
              <Input
                id="collectedAt"
                type="datetime-local"
                value={formData.collectedAt}
                onChange={(e) => setFormData({ ...formData, collectedAt: e.target.value })}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Collection Location</Label>
              <Input
                id="location"
                placeholder="e.g., 123 Main St, Site A"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="40.7580"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="-73.9855"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>

            {/* Related Report */}
            <div className="space-y-2">
              <Label htmlFor="reportId">Related Report ID (Optional)</Label>
              <Input
                id="reportId"
                placeholder="Enter report ID to link this evidence"
                value={formData.reportId}
                onChange={(e) => setFormData({ ...formData, reportId: e.target.value })}
              />
            </div>

            {/* Related Case */}
            <div className="space-y-2">
              <Label htmlFor="caseId">Related Case ID (Optional)</Label>
              <Input
                id="caseId"
                placeholder="Enter case ID to link this evidence"
                value={formData.caseId}
                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., water, contamination, urgent"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading || uploading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {uploading ? 'Uploading...' : 'Creating...'}
              </>
            ) : (
              <>
                <Archive className="h-4 w-4 mr-2" />
                Create Evidence
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
