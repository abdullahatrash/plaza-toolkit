'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useUiStore } from '@/lib/stores/ui.store';
import { cn } from '@workspace/lib/utils';
import {
  Home,
  FileText,
  Map,
  Briefcase,
  BarChart3,
  Brain,
  Users,
  Settings,
  HelpCircle,
  ChevronRight,
  Shield,
  Camera,
  AlertTriangle,
  Gavel,
  Activity,
  X
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Badge } from '@workspace/ui/components/badge';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  roles?: string[];
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['OFFICER', 'ANALYST', 'PROSECUTOR', 'ADMIN', 'CITIZEN']
  },
  // Citizen-specific navigation (simplified)
  {
    id: 'my-reports',
    label: 'My Reports',
    href: '/dashboard/reports/my',
    icon: FileText,
    roles: ['CITIZEN']
  },
  {
    id: 'submit-report',
    label: 'Submit Report',
    href: '/dashboard/reports/new',
    icon: AlertTriangle,
    roles: ['CITIZEN']
  },
  // Officer/Admin navigation (full access)
  {
    id: 'reports',
    label: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    roles: ['OFFICER', 'ANALYST', 'PROSECUTOR', 'ADMIN'],
    children: [
      {
        id: 'all-reports',
        label: 'All Reports',
        href: '/dashboard/reports',
        icon: FileText,
        roles: ['OFFICER', 'ANALYST', 'PROSECUTOR', 'ADMIN']
      },
      {
        id: 'my-reports-officer',
        label: 'My Reports',
        href: '/dashboard/reports/my',
        icon: FileText,
        roles: ['OFFICER']
      },
      {
        id: 'new-report-officer',
        label: 'New Report',
        href: '/dashboard/reports/new',
        icon: AlertTriangle,
        roles: ['OFFICER']
      }
    ]
  },
  {
    id: 'map',
    label: 'Map Explorer',
    href: '/dashboard/map',
    icon: Map,
    roles: ['OFFICER', 'ANALYST', 'ADMIN']
  },
  {
    id: 'cases',
    label: 'Cases',
    href: '/dashboard/cases',
    icon: Briefcase,
    roles: ['OFFICER', 'ANALYST', 'PROSECUTOR', 'ADMIN'],
    children: [
      {
        id: 'active-cases',
        label: 'Active Cases',
        href: '/dashboard/cases?status=active',
        icon: Briefcase,
        roles: ['PROSECUTOR', 'ADMIN']
      },
      {
        id: 'my-cases',
        label: 'My Cases',
        href: '/dashboard/cases/my',
        icon: Briefcase,
        roles: ['PROSECUTOR']
      },
      {
        id: 'court-calendar',
        label: 'Court Calendar',
        href: '/dashboard/cases/calendar',
        icon: Gavel,
        roles: ['PROSECUTOR']
      }
    ]
  },
  {
    id: 'evidence',
    label: 'Evidence',
    href: '/dashboard/evidence',
    icon: Camera,
    roles: ['OFFICER', 'ANALYST', 'PROSECUTOR', 'ADMIN']
  },
  {
    id: 'analysis',
    label: 'AI Analysis',
    href: '/dashboard/analysis',
    icon: Brain,
    roles: ['ANALYST', 'ADMIN'],
    children: [
      {
        id: 'new-analysis',
        label: 'New Analysis',
        href: '/dashboard/analysis/new',
        icon: Brain,
        roles: ['ANALYST', 'ADMIN']
      },
      {
        id: 'analysis-history',
        label: 'History',
        href: '/dashboard/analysis/history',
        icon: Activity,
        roles: ['ANALYST', 'ADMIN']
      },
      {
        id: 'xai',
        label: 'Explainable AI',
        href: '/dashboard/analysis/xai',
        icon: Brain,
        roles: ['ANALYST', 'ADMIN']
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: ['ANALYST', 'ADMIN']
  },
  {
    id: 'users',
    label: 'User Management',
    href: '/dashboard/users',
    icon: Users,
    roles: ['ADMIN']
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['OFFICER', 'ANALYST', 'PROSECUTOR', 'ADMIN', 'CITIZEN']
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
    roles: ['OFFICER', 'ANALYST', 'PROSECUTOR', 'ADMIN', 'CITIZEN']
  }
];

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useUiStore();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item =>
    !item.roles || item.roles.includes(user?.role || '')
  );

  const isActive = (item: NavItem, level: number) => {
    // For dashboard home, must match exactly
    if (item.href === '/dashboard') {
      return pathname === '/dashboard';
    }

    // For child items (level > 0), match exactly
    if (level > 0) {
      return pathname === item.href || pathname.startsWith(item.href + '/');
    }

    // For parent items with children, active if any child matches
    if (item.children && item.children.length > 0) {
      return item.children.some(child =>
        pathname === child.href || pathname.startsWith(child.href + '/')
      );
    }

    // For parent items without children, use starts with
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  const NavLink = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const Icon = item.icon;
    const active = isActive(item, level);

    return (
      <Button
        variant={active ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-2',
          level > 0 && 'pl-8',
          active && 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        )}
        onClick={() => {
          router.push(item.href);
          if (window.innerWidth < 1024) {
            setSidebarOpen(false);
          }
        }}
      >
        <Icon className={cn('h-4 w-4', sidebarCollapsed && level === 0 && 'h-5 w-5')} />
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    );
  };

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
          'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-white transition-all duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b p-4">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Navigation</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn(sidebarCollapsed && 'mx-auto')}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronRight className={cn(
                'h-4 w-4 transition-transform',
                sidebarCollapsed ? '' : 'rotate-180'
              )} />
            </Button>
          </div>

          {/* Navigation Items */}
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <div key={item.id}>
                  <NavLink item={item} />
                  {!sidebarCollapsed && item.children && (
                    <div className="mt-1 space-y-1">
                      {item.children
                        .filter(child => !child.roles || child.roles.includes(user?.role || ''))
                        .map((child) => (
                          <NavLink key={child.id} item={child} level={1} />
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div className="border-t p-4">
              <div className="text-xs text-gray-500">
                <p>PLAZA Toolkit v1.0</p>
                <p className="mt-1">© 2024 Environmental Protection</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}