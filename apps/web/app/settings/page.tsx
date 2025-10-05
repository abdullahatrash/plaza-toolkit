'use client';

import { Settings } from 'lucide-react';
import { EmptyState } from '@workspace/ui/components/empty-state';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and application preferences
        </p>
      </div>

      <EmptyState
        icon={Settings}
        title="Settings Coming Soon"
        description="User preferences, account settings, and configuration options will be available in a future update."
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push('/dashboard')
        }}
      />
    </div>
  );
}
