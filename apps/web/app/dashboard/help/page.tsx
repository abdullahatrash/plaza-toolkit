'use client';

import { HelpCircle } from 'lucide-react';
import { EmptyState } from '@workspace/ui/components/empty-state';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground mt-2">
          Get assistance and learn how to use the platform
        </p>
      </div>

      <EmptyState
        icon={HelpCircle}
        title="Help Center Coming Soon"
        description="Documentation, FAQs, tutorials, and support resources will be available in a future update."
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push('/dashboard')
        }}
      />
    </div>
  );
}
