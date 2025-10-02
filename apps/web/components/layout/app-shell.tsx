'use client';

import { useUiStore } from '@/lib/stores/ui.store';
import { cn } from '@workspace/lib/utils';
import { TopNav } from './top-nav';
import { SideNav } from './side-nav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <SideNav />
      <main
        className={cn(
          'transition-all duration-300 pt-20',
          'px-4 lg:px-6 pb-8',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}