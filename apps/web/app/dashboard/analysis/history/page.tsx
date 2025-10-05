'use client';

import { History } from 'lucide-react';
import { EmptyState } from '@workspace/ui/components/empty-state';
import { useRouter } from 'next/navigation';

export default function AnalysisHistoryPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
        <p className="text-muted-foreground mt-2">
          View past analysis jobs and their results
        </p>
      </div>

      <EmptyState
        icon={History}
        title="Analysis History Coming Soon"
        description="View, filter, and review completed analysis jobs and their insights will be available in a future update."
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push('/dashboard')
        }}
      />
    </div>
  );
}
