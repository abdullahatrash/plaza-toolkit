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
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Priority } from '@workspace/database';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CreateCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  reportTitle: string;
}

export function CreateCaseDialog({
  open,
  onOpenChange,
  reportId,
  reportTitle,
}: CreateCaseDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState(`Investigation: ${reportTitle}`);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a case title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a case description');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          reportIds: [reportId],
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create case');
      }

      const data = await response.json();
      toast.success('Case created successfully');
      onOpenChange(false);

      // Navigate to the newly created case
      if (data.data?.id) {
        router.push(`/dashboard/cases/${data.data.id}`);
      }
    } catch (error: any) {
      console.error('Create case error:', error);
      toast.error(error.message || 'Failed to create case');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
          <DialogDescription>
            Create an investigation case from this report. You can add more reports to the case later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="case-title">Case Title *</Label>
            <Input
              id="case-title"
              placeholder="Enter case title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case-description">Description *</Label>
            <Textarea
              id="case-description"
              placeholder="Describe the investigation objectives and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case-priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
            >
              <SelectTrigger id="case-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Priority.CRITICAL}>Critical</SelectItem>
                <SelectItem value={Priority.HIGH}>High</SelectItem>
                <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={Priority.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium mb-1">Initial Report:</p>
            <p className="text-muted-foreground">{reportTitle}</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !description.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create Case'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
