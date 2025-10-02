'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { Label } from '@workspace/ui/components/label';
import { ReportStatus } from '@workspace/database';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  currentStatus: ReportStatus;
  onSuccess: () => void;
}

// Valid status transitions for officers
const STATUS_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  [ReportStatus.SUBMITTED]: [ReportStatus.UNDER_REVIEW],
  [ReportStatus.UNDER_REVIEW]: [ReportStatus.IN_PROGRESS, ReportStatus.DISMISSED],
  [ReportStatus.IN_PROGRESS]: [ReportStatus.RESOLVED, ReportStatus.DISMISSED],
  [ReportStatus.RESOLVED]: [], // Can't change from resolved
  [ReportStatus.DISMISSED]: [], // Can't change from dismissed
};

export function UpdateStatusDialog({
  open,
  onOpenChange,
  reportId,
  currentStatus,
  onSuccess,
}: UpdateStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<ReportStatus | ''>('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  const canTransition = allowedTransitions.length > 0;

  const handleSubmit = async () => {
    if (!newStatus) {
      toast.error('Please select a new status');
      return;
    }

    if (!note.trim()) {
      toast.error('Please provide a reason for the status change');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: note.trim(),
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      toast.success('Report status updated successfully');
      onOpenChange(false);
      setNewStatus('');
      setNote('');
      onSuccess();
    } catch (error: any) {
      console.error('Status update error:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusLabel = (status: ReportStatus) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Report Status</DialogTitle>
          <DialogDescription>
            Change the status of this report and provide a reason for the update.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!canTransition ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This report is in {getStatusLabel(currentStatus)} status and cannot be changed.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="current-status">Current Status</Label>
                <div className="text-sm font-medium capitalize p-2 bg-muted rounded-md">
                  {getStatusLabel(currentStatus)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-status">New Status *</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value) => setNewStatus(value as ReportStatus)}
                >
                  <SelectTrigger id="new-status">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedTransitions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Reason for Status Change *</Label>
                <Textarea
                  id="note"
                  placeholder="Explain why you are changing the status..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  This note will be visible in the activity timeline
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {canTransition && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !newStatus || !note.trim()}
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
