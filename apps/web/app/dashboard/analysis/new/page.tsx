'use client';

import { Sparkles } from 'lucide-react';
import { EmptyState } from '@workspace/ui/components/empty-state';
import { useRouter } from 'next/navigation';

export default function NewAnalysisPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Create a new AI-powered analysis job
        </p>
      </div>

      <EmptyState
        icon={Sparkles}
        title="AI Analysis Coming Soon"
        description="Create and submit new analysis jobs for pattern detection, trend analysis, and insights will be available in a future update."
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push('/dashboard')
        }}
      />
    </div>
  );
}
