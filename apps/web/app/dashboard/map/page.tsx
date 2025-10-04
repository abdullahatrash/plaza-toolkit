'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DynamicMap, { MapMarker } from '@/components/map/dynamic-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Input } from '@workspace/ui/components/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import {
  MapPin,
  Search,
  Filter,
  Download,
  AlertTriangle,
  TrendingUp,
  Activity,
  Layers,
  Eye
} from 'lucide-react';
import { ReportType, ReportStatus, Priority } from '@workspace/database';

// Mock data - will be replaced with API calls
const generateMockReports = (): MapMarker[] => {
  const reports: MapMarker[] = [
    {
      id: '1',
      position: [40.7580, -73.9855] as [number, number],
      type: 'report' as const,
      data: {
        id: '1',
        title: 'Chemical Spill in Hudson River',
        description: 'Large chemical spill detected near pier 45',
        type: ReportType.POLLUTION,
        priority: Priority.CRITICAL,
        status: ReportStatus.IN_PROGRESS,
        location: 'Hudson River, Pier 45',
        incidentDate: new Date('2024-01-15'),
        reportNumber: 'ENV-2024-0145'
      }
    },
    {
      id: '2',
      position: [40.7614, -73.9776] as [number, number],
      type: 'report' as const,
      data: {
        id: '2',
        title: 'Illegal Dumping Site',
        description: 'Construction debris illegally dumped',
        type: ReportType.WASTE,
        priority: Priority.HIGH,
        status: ReportStatus.UNDER_REVIEW,
        location: 'Central Park West',
        incidentDate: new Date('2024-01-14'),
        reportNumber: 'ENV-2024-0144'
      }
    },
    {
      id: '3',
      position: [40.7488, -73.9857] as [number, number],
      type: 'report' as const,
      data: {
        id: '3',
        title: 'Water Quality Alert',
        description: 'Unusual coloration in water samples',
        type: ReportType.WATER_QUALITY,
        priority: Priority.MEDIUM,
        status: ReportStatus.SUBMITTED,
        location: 'Empire State Building Area',
        incidentDate: new Date('2024-01-13'),
        reportNumber: 'ENV-2024-0143'
      }
    },
    {
      id: '4',
      position: [40.7505, -73.9934] as [number, number],
      type: 'report' as const,
      data: {
        id: '4',
        title: 'Wildlife Disturbance',
        description: 'Protected birds nesting area disturbed',
        type: ReportType.WILDLIFE,
        priority: Priority.HIGH,
        status: ReportStatus.IN_PROGRESS,
        location: 'High Line Park',
        incidentDate: new Date('2024-01-12'),
        reportNumber: 'ENV-2024-0142'
      }
    },
    {
      id: '5',
      position: [40.7589, -73.9851] as [number, number],
      type: 'report' as const,
      data: {
        id: '5',
        title: 'Air Pollution Spike',
        description: 'Elevated PM2.5 levels detected',
        type: ReportType.POLLUTION,
        priority: Priority.MEDIUM,
        status: ReportStatus.RESOLVED,
        location: 'Times Square',
        incidentDate: new Date('2024-01-11'),
        reportNumber: 'ENV-2024-0141'
      }
    },
    {
      id: '6',
      position: [40.7678, -73.9916] as [number, number],
      type: 'report' as const,
      data: {
        id: '6',
        title: 'Noise Pollution Complaint',
        description: 'Excessive construction noise outside permitted hours',
        type: ReportType.NOISE,
        priority: Priority.LOW,
        status: ReportStatus.UNDER_REVIEW,
        location: 'Upper West Side',
        incidentDate: new Date('2024-01-10'),
        reportNumber: 'ENV-2024-0140'
      }
    }
  ];

  // Add cluster of reports in specific areas
  const clusters = [
    { lat: 40.7489, lng: -73.9680, count: 5 }, // East side cluster
    { lat: 40.7831, lng: -73.9712, count: 8 }, // Upper east side
    { lat: 40.7282, lng: -73.9942, count: 6 }, // Lower manhattan
  ];

  clusters.forEach((cluster, clusterIdx) => {
    for (let i = 0; i < cluster.count; i++) {
      const offset = 0.002;
      reports.push({
        id: `cluster-${clusterIdx}-${i}`,
        position: [
          cluster.lat + (Math.random() - 0.5) * offset,
          cluster.lng + (Math.random() - 0.5) * offset
        ] as [number, number],
        type: 'report' as const,
        data: {
          id: `cluster-${clusterIdx}-${i}`,
          title: `Environmental Incident #${reports.length + 1}`,
          description: 'Automated monitoring alert',
          type: Object.values(ReportType)[Math.floor(Math.random() * 6)] as ReportType,
          priority: Object.values(Priority)[Math.floor(Math.random() * 4)] as Priority,
          status: Object.values(ReportStatus)[Math.floor(Math.random() * 5)],
          location: `Location ${reports.length + 1}`,
          incidentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          reportNumber: `ENV-2024-${String(reports.length + 100).padStart(4, '0')}`
        }
      });
    }
  });

  return reports;
};

export default function MapExplorePage() {
  const router = useRouter();
  const [reports, setReports] = useState<MapMarker[]>([]);
  const [selectedReport, setSelectedReport] = useState<MapMarker | null>(null);
  const [clusterReports, setClusterReports] = useState<MapMarker[] | null>(null);
  const [mapView, setMapView] = useState<'cluster' | 'heat' | 'individual'>('cluster');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load mock reports - replace with API call
    setReports(generateMockReports());
  }, []);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedReport(marker);
    setClusterReports(null);
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Could open a new report form with these coordinates
    console.log('Map clicked at:', lat, lng);
  };

  const handleClusterClick = (markers: MapMarker[]) => {
    setClusterReports(markers);
    setSelectedReport(null);
  };

  // Stats calculation
  const stats = {
    total: reports.length,
    critical: reports.filter(r => r.data?.priority === Priority.CRITICAL).length,
    investigating: reports.filter(r => r.data?.status === ReportStatus.IN_PROGRESS).length,
    resolved: reports.filter(r => r.data?.status === ReportStatus.RESOLVED).length
  };

  return (
    <div className="-m-6 h-[calc(100vh-64px)] flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Environmental Map</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time environmental incident monitoring
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm" onClick={() => router.push('/reports/new')}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className="w-96 bg-card border-r flex flex-col flex-shrink-0 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations, report numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-4 grid grid-cols-2 gap-3">
            <Card className="border bg-card hover:bg-accent/50 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Reports</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="border bg-card hover:bg-accent/50 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Critical</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-500">{stats.critical}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border bg-card hover:bg-accent/50 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">Investigating</p>
                    <p className="text-xl font-bold text-yellow-700 dark:text-yellow-500">{stats.investigating}</p>
                  </div>
                  <Eye className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="border bg-card hover:bg-accent/50 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400">Resolved</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-500">{stats.resolved}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View Controls */}
          <div className="px-4 pb-4">
            <Tabs value={mapView} onValueChange={(v) => setMapView(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cluster">Clusters</TabsTrigger>
                <TabsTrigger value="heat">Heat Map</TabsTrigger>
                <TabsTrigger value="individual">Individual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Selected Report Details */}
          {selectedReport && (
            <div className="flex-1 overflow-auto border-t">
              <Card className="m-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedReport.data?.title}
                  </CardTitle>
                  <CardDescription>
                    {selectedReport.data?.reportNumber}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedReport.data?.priority === Priority.CRITICAL ? 'destructive' : 'secondary'}>
                      {selectedReport.data?.priority}
                    </Badge>
                    <Badge>
                      {selectedReport.data?.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedReport.data?.description}
                  </p>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {selectedReport.data?.location}
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => router.push(`/reports/${selectedReport.data?.id}`)}
                  >
                    View Full Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Cluster Reports List */}
          {!selectedReport && clusterReports && (
            <div className="flex-1 overflow-auto border-t">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">
                    Cluster Reports ({clusterReports.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClusterReports(null)}
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  {clusterReports.map((report) => (
                    <Card
                      key={report.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{report.data?.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{report.data?.location}</p>
                          </div>
                          <Badge
                            variant={report.data?.priority === Priority.CRITICAL ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {report.data?.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Reports List */}
          {!selectedReport && !clusterReports && (
            <div className="flex-1 overflow-auto border-t">
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3">Recent Reports</h3>
                <div className="space-y-2">
                  {reports.slice(0, 5).map((report) => (
                    <Card
                      key={report.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{report.data?.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{report.data?.location}</p>
                          </div>
                          <Badge
                            variant={report.data?.priority === Priority.CRITICAL ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {report.data?.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative h-full">
          <div className="absolute inset-0">
            <DynamicMap
              center={[40.7580, -73.9855]}
              zoom={12}
              markers={reports}
              showClusters={mapView === 'cluster'}
              showHeatmap={mapView === 'heat'}
              showDrawControls={false}
              showFilters={true}
              height="100%"
              onMarkerClick={handleMarkerClick}
              onMapClick={handleMapClick}
              onClusterClick={handleClusterClick}
            />
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-card border rounded-lg shadow-lg p-3 z-[400]">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-semibold">Report Types</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span>🏭</span> Pollution
              </div>
              <div className="flex items-center gap-2">
                <span>🦅</span> Wildlife
              </div>
              <div className="flex items-center gap-2">
                <span>💧</span> Water Quality
              </div>
              <div className="flex items-center gap-2">
                <span>🗑️</span> Illegal Dumping
              </div>
              <div className="flex items-center gap-2">
                <span>☢️</span> Chemical Spill
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}