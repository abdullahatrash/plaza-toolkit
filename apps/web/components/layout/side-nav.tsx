'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useUiStore } from '@/lib/stores/ui.store';
import { getRoleConfig, type NavItem } from '@/lib/rbac-config';
import { cn } from '@workspace/lib/utils';
import {
  ChevronRight,
  ChevronDown,
  Shield
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Badge } from '@workspace/ui/components/badge';
import { useState } from 'react';
import { UserRole } from '@workspace/database';

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useUiStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Get role-specific navigation
  const roleConfig = user?.role ? getRoleConfig(user.role as UserRole) : null;
  const navigation = roleConfig?.navigation || [];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (item: NavItem): boolean => {
    // Exact match for dashboard
    if (item.href === '/dashboard') {
      return pathname === '/dashboard';
    }

    // For items with children, check if any child is active
    if (item.children && item.children.length > 0) {
      return item.children.some(child =>
        pathname === child.href || pathname.startsWith(child.href + '/')
      );
    }

    // Standard path matching
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  const NavLink = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const Icon = item.icon;
    const active = isActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    const handleClick = () => {
      if (hasChildren && !sidebarCollapsed) {
        toggleExpanded(item.id);
      } else {
        router.push(item.href);
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
      }
    };

    return (
      <>
        <Button
          variant={active ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start gap-3 transition-all',
            level > 0 && 'pl-10 text-sm h-9',
            level === 0 && 'font-medium h-10',
            active && 'bg-accent',
            sidebarCollapsed && level === 0 && 'justify-center px-2'
          )}
          onClick={handleClick}
          title={sidebarCollapsed ? item.label : undefined}
        >
          <Icon className={cn(
            'h-4 w-4 flex-shrink-0',
            sidebarCollapsed && level === 0 && 'h-5 w-5'
          )} />

          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>

              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}

              {hasChildren && (
                <ChevronDown className={cn(
                  'h-4 w-4 flex-shrink-0 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )} />
              )}
            </>
          )}
        </Button>

        {/* Render children if expanded and not collapsed */}
        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="mt-0.5 space-y-0.5 ml-2 border-l pl-3">
            {item.children!.map((child) => (
              <NavLink key={child.id} item={child} level={1} />
            ))}
          </div>
        )}
      </>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className={cn(
            "flex items-center border-b px-3 py-4",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-semibold tracking-tight">
                  {roleConfig?.displayName || 'Navigation'}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="h-8 w-8"
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  !sidebarCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>

          {/* Navigation Items */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.id} item={item} />
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div className="border-t px-4 py-3">
              <div className="text-xs text-muted-foreground">
                <p className="font-medium">PLAZA Toolkit v1.0</p>
                <p className="mt-1">Environmental Protection</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
