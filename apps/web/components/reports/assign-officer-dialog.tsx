'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { toast } from 'sonner';

interface Officer {
  id: string;
  name: string;
  email: string;
  badge?: string;
  department?: string;
}

interface AssignOfficerDialogProps {
  reportId: string;
  reportTitle: string;
  currentAssigneeId?: string;
  currentAssigneeName?: string;
}

export function AssignOfficerDialog({
  reportId,
  reportTitle,
  currentAssigneeId,
  currentAssigneeName
}: AssignOfficerDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>(currentAssigneeId || '');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchOfficers();
    }
  }, [open]);

  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users?role=OFFICER&limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch officers');
      }
      const data = await response.json();
      setOfficers(data.users || []);
    } catch (error) {
      console.error('Error fetching officers:', error);
      toast.error('Failed to load officers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedOfficerId) {
      toast.error('Please select an officer to assign.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assigneeId: selectedOfficerId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to assign officer');
      }

      toast.success('Officer assigned successfully.');

      setOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error('Error assigning officer:', error);
      toast.error(error.message || 'Failed to assign officer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="mt-2">
          <UserPlus className="mr-2 h-4 w-4" />
          {currentAssigneeName ? 'Reassign Officer' : 'Assign Officer'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Officer</DialogTitle>
          <DialogDescription>
            Assign an officer to investigate this report: &quot;{reportTitle}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {currentAssigneeName && (
            <div className="text-sm text-muted-foreground">
              Currently assigned to: <span className="font-medium">{currentAssigneeName}</span>
            </div>
          )}
          <div className="grid gap-2">
            <label htmlFor="officer" className="text-sm font-medium">
              Select Officer
            </label>
            <Select
              value={selectedOfficerId}
              onValueChange={setSelectedOfficerId}
              disabled={loading || submitting}
            >
              <SelectTrigger id="officer">
                <SelectValue placeholder={loading ? "Loading officers..." : "Select an officer"} />
              </SelectTrigger>
              <SelectContent>
                {officers.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{officer.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {officer.badge && `Badge: ${officer.badge}`}
                        {officer.badge && officer.department && ' • '}
                        {officer.department}
                      </span>
                    </div>
                  </SelectItem>
                ))}
                {officers.length === 0 && !loading && (
                  <div className="p-2 text-sm text-muted-foreground">
                    No officers available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={submitting || !selectedOfficerId || loading}
          >
            {submitting ? 'Assigning...' : 'Assign Officer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
