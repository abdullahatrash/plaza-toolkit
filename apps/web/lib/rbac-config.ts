/**
 * RBAC Configuration for PLAZA Toolkit
 * Defines role-based access control for all features
 */

import { UserRole } from '@workspace/database';
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
  Shield,
  Camera,
  AlertTriangle,
  Gavel,
  Activity,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badge?: string;
  description?: string;
  children?: NavItem[];
}

export interface RoleConfig {
  role: UserRole;
  displayName: string;
  color: string; // Tailwind color class
  dashboardPath: string;
  navigation: NavItem[];
  permissions: string[];
}

/**
 * Navigation structure per role based on PLAZA_UI_Design_Document.md
 */

// OFFICER Navigation
const officerNavigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and recent activity'
  },
  {
    id: 'explore-map',
    label: 'Explore Map',
    href: '/dashboard/map',
    icon: Map,
    description: 'Geospatial incident mapping'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    description: 'Manage incident reports',
    children: [
      {
        id: 'assigned-reports',
        label: 'Assigned to Me',
        href: '/dashboard/reports/assigned',
        icon: Shield
      },
      {
        id: 'all-reports',
        label: 'All Reports',
        href: '/dashboard/reports',
        icon: FileText
      }
    ]
  },
  {
    id: 'my-cases',
    label: 'My Cases',
    href: '/dashboard/cases',
    icon: Briefcase,
    description: 'Active investigations'
  },
  {
    id: 'evidence',
    label: 'Evidence',
    href: '/dashboard/evidence',
    icon: Camera,
    description: 'Chain of custody tracking'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle
  }
];

// ANALYST Navigation
const analystNavigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Analysis jobs and system overview'
  },
  {
    id: 'explore-map',
    label: 'Explore Map',
    href: '/dashboard/map',
    icon: Map,
    description: 'Map-based analysis'
  },
  {
    id: 'analysis',
    label: 'Analysis',
    href: '/dashboard/analysis',
    icon: Brain,
    description: 'AI analysis jobs',
    children: [
      {
        id: 'new-analysis',
        label: 'New Analysis',
        href: '/dashboard/analysis/new',
        icon: TrendingUp
      },
      {
        id: 'analysis-history',
        label: 'History',
        href: '/dashboard/analysis/history',
        icon: Clock
      },
      {
        id: 'xai',
        label: 'Explainable AI',
        href: '/dashboard/analysis/xai',
        icon: Shield
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Data insights and trends'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    description: 'Review submitted reports'
  },
  {
    id: 'cases',
    label: 'Cases',
    href: '/dashboard/cases',
    icon: Briefcase,
    description: 'Investigation cases'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle
  }
];

// PROSECUTOR Navigation
const prosecutorNavigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Escalated cases overview'
  },
  {
    id: 'cases',
    label: 'Cases (Escalated)',
    href: '/dashboard/cases',
    icon: Briefcase,
    description: 'Cases for legal review',
    children: [
      {
        id: 'active-cases',
        label: 'Active Cases',
        href: '/dashboard/cases?status=ACTIVE',
        icon: Activity
      },
      {
        id: 'court-calendar',
        label: 'Court Calendar',
        href: '/dashboard/cases/calendar',
        icon: Calendar
      }
    ]
  },
  {
    id: 'reports-archive',
    label: 'Reports Archive',
    href: '/dashboard/reports',
    icon: FileText,
    description: 'Historical reports'
  },
  {
    id: 'evidence',
    label: 'Evidence',
    href: '/dashboard/evidence',
    icon: Camera,
    description: 'Evidence review'
  },
  {
    id: 'statistics',
    label: 'Statistics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Case statistics'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle
  }
];

// ADMIN Navigation
const adminNavigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'System overview'
  },
  {
    id: 'user-management',
    label: 'User Management',
    href: '/dashboard/users',
    icon: Users,
    description: 'Manage system users'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    description: 'All system reports'
  },
  {
    id: 'cases',
    label: 'Cases',
    href: '/dashboard/cases',
    icon: Briefcase,
    description: 'All investigations'
  },
  {
    id: 'evidence',
    label: 'Evidence',
    href: '/dashboard/evidence',
    icon: Camera,
    description: 'Evidence management'
  },
  {
    id: 'explore-map',
    label: 'Explore Map',
    href: '/dashboard/map',
    icon: Map,
    description: 'System-wide map view'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'System analytics'
  },
  {
    id: 'settings',
    label: 'System Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Platform configuration'
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle
  }
];

// CITIZEN Navigation (Simplified)
const citizenNavigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Your reports overview'
  },
  {
    id: 'my-reports',
    label: 'My Reports',
    href: '/dashboard/reports/my',
    icon: FileText,
    description: 'Track your submissions'
  },
  {
    id: 'submit-report',
    label: 'Submit Report',
    href: '/dashboard/reports/new',
    icon: AlertTriangle,
    description: 'Report an incident'
  },
  {
    id: 'explore-map',
    label: 'Explore Map',
    href: '/dashboard/map',
    icon: Map,
    description: 'View incident map'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle
  }
];

/**
 * Complete RBAC Configuration
 */
export const RBAC_CONFIG: Record<UserRole, RoleConfig> = {
  [UserRole.OFFICER]: {
    role: UserRole.OFFICER,
    displayName: 'Officer',
    color: 'purple',
    dashboardPath: '/dashboard',
    navigation: officerNavigation,
    permissions: [
      'reports.view',
      'reports.create',
      'reports.update',
      'reports.assign',
      'cases.view',
      'cases.create',
      'cases.update',
      'evidence.view',
      'evidence.create',
      'map.view',
      'map.draw'
    ]
  },

  [UserRole.ANALYST]: {
    role: UserRole.ANALYST,
    displayName: 'Data Analyst',
    color: 'teal',
    dashboardPath: '/dashboard',
    navigation: analystNavigation,
    permissions: [
      'reports.view',
      'cases.view',
      'analysis.view',
      'analysis.create',
      'analysis.run',
      'analytics.view',
      'xai.view',
      'map.view',
      'map.analysis'
    ]
  },

  [UserRole.PROSECUTOR]: {
    role: UserRole.PROSECUTOR,
    displayName: 'Prosecutor',
    color: 'indigo',
    dashboardPath: '/dashboard',
    navigation: prosecutorNavigation,
    permissions: [
      'cases.view',
      'cases.review',
      'cases.approve',
      'cases.reject',
      'reports.view',
      'evidence.view',
      'court.manage'
    ]
  },

  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    displayName: 'Administrator',
    color: 'gray',
    dashboardPath: '/dashboard',
    navigation: adminNavigation,
    permissions: ['*'] // Admin has all permissions
  },

  [UserRole.CITIZEN]: {
    role: UserRole.CITIZEN,
    displayName: 'Citizen',
    color: 'green',
    dashboardPath: '/dashboard',
    navigation: citizenNavigation,
    permissions: [
      'reports.create',
      'reports.view.own',
      'map.view',
      'notifications.view'
    ]
  }
};

/**
 * Get role configuration
 */
export function getRoleConfig(role: UserRole): RoleConfig {
  return RBAC_CONFIG[role];
}

/**
 * Check if user has permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const config = getRoleConfig(role);
  if (config.permissions.includes('*')) return true;
  return config.permissions.includes(permission);
}

/**
 * Get role-specific color classes
 */
export function getRoleColorClasses(role: UserRole) {
  const colors = {
    [UserRole.OFFICER]: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-300'
    },
    [UserRole.ANALYST]: {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      border: 'border-teal-300'
    },
    [UserRole.PROSECUTOR]: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      border: 'border-indigo-300'
    },
    [UserRole.ADMIN]: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300'
    },
    [UserRole.CITIZEN]: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300'
    }
  };

  return colors[role];
}
