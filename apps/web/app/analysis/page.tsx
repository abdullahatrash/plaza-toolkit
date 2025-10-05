'use client';

import { BarChart3 } from 'lucide-react';
import { EmptyState } from '@workspace/ui/components/empty-state';
import { useRouter } from 'next/navigation';

export default function AnalysisPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analysis</h1>
        <p className="text-muted-foreground mt-2">
          View analytics and insights from incident data
        </p>
      </div>

      <EmptyState
        icon={BarChart3}
        title="Analysis Coming Soon"
        description="Data analytics, charts, trends, and insights will be available in a future update."
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push('/dashboard')
        }}
      />
    </div>
  );
}
