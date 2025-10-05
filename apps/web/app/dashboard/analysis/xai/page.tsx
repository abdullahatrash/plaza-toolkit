'use client';

import { Brain } from 'lucide-react';
import { EmptyState } from '@workspace/ui/components/empty-state';
import { useRouter } from 'next/navigation';

export default function XAIPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Explainable AI</h1>
        <p className="text-muted-foreground mt-2">
          Understand AI analysis decisions and reasoning
        </p>
      </div>

      <EmptyState
        icon={Brain}
        title="Explainable AI Coming Soon"
        description="View detailed explanations of AI analysis decisions, model reasoning, and confidence scores will be available in a future update."
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push('/dashboard')
        }}
      />
    </div>
  );
}
