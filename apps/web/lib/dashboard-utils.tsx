import { Badge } from '@workspace/ui/components/badge';
import {
  FileText,
  Clock,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pause
} from 'lucide-react';

/**
 * Status badge configuration with colors and icons
 */
export const statusConfig = {
  // Report Status Colors
  SUBMITTED: {
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    icon: FileText,
    label: 'Submitted'
  },
  UNDER_REVIEW: {
    color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    icon: Clock,
    label: 'Under Review'
  },
  IN_PROGRESS: {
    color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    icon: Activity,
    label: 'In Progress'
  },
  RESOLVED: {
    color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    icon: TrendingUp,
    label: 'Resolved'
  },
  DISMISSED: {
    color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    icon: XCircle,
    label: 'Dismissed'
  },
  CLOSED: {
    color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    icon: CheckCircle2,
    label: 'Closed'
  },
  REJECTED: {
    color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    icon: XCircle,
    label: 'Rejected'
  },
  ON_HOLD: {
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    icon: Pause,
    label: 'On Hold'
  },

  // Priority Colors
  CRITICAL: {
    color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    icon: AlertTriangle,
    label: 'Critical'
  },
  HIGH: {
    color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    icon: AlertTriangle,
    label: 'High'
  },
  MEDIUM: {
    color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    icon: Activity,
    label: 'Medium'
  },
  LOW: {
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    icon: Activity,
    label: 'Low'
  },
} as const;

/**
 * Dashboard stat card configuration with colors and trends
 */
export const dashboardStatConfig = {
  total: {
    color: 'text-blue-600 dark:text-blue-400',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    icon: FileText,
    trend: null
  },
  submitted: {
    color: 'text-blue-600 dark:text-blue-400',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    icon: FileText,
    trend: null
  },
  underReview: {
    color: 'text-yellow-600 dark:text-yellow-400',
    badgeColor: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    icon: Clock,
    trend: null
  },
  inProgress: {
    color: 'text-orange-600 dark:text-orange-400',
    badgeColor: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    icon: Activity,
    trend: null
  },
  resolved: {
    color: 'text-green-600 dark:text-green-400',
    badgeColor: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    icon: TrendingUp,
    trend: 'up'
  },
  closed: {
    color: 'text-gray-600 dark:text-gray-400',
    badgeColor: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    icon: CheckCircle2,
    trend: null
  },
  rejected: {
    color: 'text-red-600 dark:text-red-400',
    badgeColor: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    icon: XCircle,
    trend: 'down'
  },
} as const;

/**
 * Renders a status badge with appropriate color and icon
 */
export function StatusBadge({
  status,
  size = 'default',
  showIcon = true
}: {
  status: string;
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
}) {
  const config = statusConfig[status as keyof typeof statusConfig];
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  // Fallback for unknown statuses
  if (!config) {
    return (
      <Badge variant="outline" className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20">
        {formatStatus(status)}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.color}>
      {showIcon && <Icon className={iconSize} />}
      {config.label}
    </Badge>
  );
}

/**
 * Renders a stat card badge with icon only (for dashboard cards)
 */
export function StatBadge({
  type,
  className = ''
}: {
  type: keyof typeof dashboardStatConfig;
  className?: string;
}) {
  const config = dashboardStatConfig[type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.badgeColor} ${className}`}>
      <Icon className="h-3 w-3" />
    </Badge>
  );
}

/**
 * Get color class for a stat value
 */
export function getStatColor(type: keyof typeof dashboardStatConfig): string {
  return dashboardStatConfig[type]?.color || '';
}

/**
 * Format status for display
 */
export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ');
}
