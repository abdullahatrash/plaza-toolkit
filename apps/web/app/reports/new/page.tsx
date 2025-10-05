'use client';

import { FileText } from 'lucide-react';
import { EmptyState } from '@workspace/ui/components/empty-state';
import { useRouter } from 'next/navigation';

export default function NewReportPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Report</h1>
        <p className="text-muted-foreground mt-2">
          Submit a new environmental incident report
        </p>
      </div>

      <EmptyState
        icon={FileText}
        title="Report Submission Coming Soon"
        description="Create and submit new incident reports with location, photos, and evidence will be available in a future update."
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push('/dashboard')
        }}
      />
    </div>
  );
}
