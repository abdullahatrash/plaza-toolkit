'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Shield,
  Package,
  Activity,
  Download,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsData {
  summary: {
    totalReports: number;
    totalCases: number;
    totalEvidence: number;
    recentActivity: number;
    reportsTrend: number;
    avgResolutionTime: number | null;
  };
  reportsByStatus: Array<{ status: string; count: number }>;
  reportsByType: Array<{ type: string; count: number }>;
  reportsByPriority: Array<{ priority: string; count: number }>;
  reportsOverTime: Array<{ date: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  casesByStatus: Array<{ status: string; count: number }>;
  userStats: Array<{ role: string; count: number }>;
  geographicData: any[];
  timeRange: number;
  generatedAt: string;
}

const COLORS = {
  primary: '#0ea5e9',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#a855f7',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6'
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: COLORS.purple,
  SUBMITTED: COLORS.primary,
  UNDER_REVIEW: COLORS.warning,
  IN_PROGRESS: COLORS.indigo,
  RESOLVED: COLORS.success,
  REJECTED: COLORS.danger,
  CLOSED: COLORS.teal
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: COLORS.success,
  MEDIUM: COLORS.warning,
  HIGH: COLORS.danger,
  CRITICAL: '#dc2626'
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30');
  const [data, setData] = useState<AnalyticsData | null>(null);

  const fetchAnalytics = async (showToast = false) => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const analyticsData = await response.json();
      setData(analyticsData);

      if (showToast) {
        toast.success('Analytics refreshed');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      toast.info(`Exporting analytics as ${format.toUpperCase()}...`);

      if (format === 'csv') {
        // Export as CSV
        if (!data) return;

        const csvData = [
          ['Metric', 'Value'],
          ['Total Reports', data.summary.totalReports],
          ['Total Cases', data.summary.totalCases],
          ['Total Evidence', data.summary.totalEvidence],
          ['Recent Activity', data.summary.recentActivity],
          ['Reports Trend (%)', data.summary.reportsTrend],
          ['Avg Resolution Time (days)', data.summary.avgResolutionTime || 'N/A'],
          [],
          ['Reports by Status'],
          ...data.reportsByStatus.map(item => [item.status, item.count]),
          [],
          ['Reports by Type'],
          ...data.reportsByType.map(item => [item.type, item.count]),
          [],
          ['Reports by Priority'],
          ...data.reportsByPriority.map(item => [item.priority, item.count])
        ];

        const csv = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plaza-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success('Analytics exported as CSV');
      } else {
        // PDF export would require a library like jsPDF
        toast.info('PDF export coming soon');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights and trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data.summary.totalReports}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {data.summary.reportsTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p className={`text-sm ${data.summary.reportsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(data.summary.reportsTrend)}% vs previous period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Shield className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data.summary.totalCases}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Investigation cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Package className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Evidence Items</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data.summary.totalEvidence}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Collected evidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="h-4 w-4" />
              <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {data.summary.avgResolutionTime ? `${data.summary.avgResolutionTime}d` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Days to resolve</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Over Time */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Reports Over Time</CardTitle>
            <CardDescription>Daily report submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.reportsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  name="Reports"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reports by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.reportsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.reportsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || COLORS.primary} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reports by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by Priority</CardTitle>
            <CardDescription>Priority level distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.reportsByPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Reports">
                  {data.reportsByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || COLORS.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reports by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by Type</CardTitle>
            <CardDescription>Incident type breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.reportsByType} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={COLORS.primary} name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Most reported areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topLocations.slice(0, 8).map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {location.location}
                    </span>
                  </div>
                  <Badge variant="secondary">{location.count} reports</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Last updated: {new Date(data.generatedAt).toLocaleString()} • Time range: Last {data.timeRange} days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'secondary' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
    }`}>
      {children}
    </span>
  );
}
