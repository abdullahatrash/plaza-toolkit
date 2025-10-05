'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DynamicMap, { MapMarker } from '@/components/map/dynamic-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Input } from '@workspace/ui/components/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
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
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAiAnalysis, setLoadingAiAnalysis] = useState(false);
  // Default center for Europe (showing pilot case study locations)
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.0, 10.0]); // Central Europe
  const [mapZoom, setMapZoom] = useState<number>(5);
  // Filter states
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Fetch real reports from API
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports?limit=100');
        const result = await response.json();

        if (result.success && result.data) {
          // Transform API reports to MapMarker format
          const apiReports = Array.isArray(result.data) ? result.data : result.data.reports || [];
          const mapMarkers: MapMarker[] = apiReports
            .filter((report: any) => report.latitude && report.longitude)
            .map((report: any) => ({
              id: report.id,
              position: [report.latitude, report.longitude] as [number, number],
              type: 'report' as const,
              data: {
                id: report.id,
                title: report.title,
                description: report.description,
                type: report.type,
                priority: report.priority,
                status: report.status,
                location: report.location,
                incidentDate: new Date(report.incidentDate || report.createdAt),
                reportNumber: report.reportNumber
              }
            }));

          setReports(mapMarkers);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        // Fallback to mock data if API fails
        setReports(generateMockReports());
      }
    };

    fetchReports();
  }, []);

  const handleMarkerClick = async (marker: MapMarker) => {
    setSelectedReport(marker);
    setClusterReports(null);

    // Fetch AI analysis for the selected report
    if (marker.data?.id) {
      setLoadingAiAnalysis(true);
      try {
        const response = await fetch(`/api/analysis?reportId=${marker.data.id}`);
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setAiAnalysis(result.data[0]); // Get the latest analysis
        } else {
          setAiAnalysis(null);
        }
      } catch (error) {
        console.error('Failed to fetch AI analysis:', error);
        setAiAnalysis(null);
      } finally {
        setLoadingAiAnalysis(false);
      }
    }
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
          <div className="p-4 pb-3 border-b">
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

          {/* View Controls */}
          <div className="px-4 pt-3 pb-3">
            <Tabs value={mapView} onValueChange={(v) => setMapView(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cluster">Clusters</TabsTrigger>
                <TabsTrigger value="heat">Heat Map</TabsTrigger>
                <TabsTrigger value="individual">Individual</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Stats Cards */}
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
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

              {/* AI Analysis Results */}
              {loadingAiAnalysis && (
                <Card className="m-4 mt-0">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Loading AI analysis...</p>
                  </CardContent>
                </Card>
              )}

              {!loadingAiAnalysis && aiAnalysis && (
                <Card className="m-4 mt-0 border-primary/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      🤖 AI Analysis Results
                    </CardTitle>
                    <CardDescription>
                      Type: {aiAnalysis.type?.replace(/_/g, ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Confidence Score */}
                    {aiAnalysis.confidence && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Confidence</span>
                          <Badge variant="outline" className="font-mono">
                            {(aiAnalysis.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${aiAnalysis.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Analysis Result */}
                    {aiAnalysis.result && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Key Findings:</p>
                        <div className="text-xs bg-muted p-3 rounded-md space-y-1">
                          {(() => {
                            try {
                              const result = typeof aiAnalysis.result === 'string'
                                ? JSON.parse(aiAnalysis.result)
                                : aiAnalysis.result;
                              return (
                                <>
                                  {result.pollutionType && (
                                    <p>• Type: <span className="font-semibold">{result.pollutionType.replace(/_/g, ' ')}</span></p>
                                  )}
                                  {result.severity && (
                                    <p>• Severity: <span className="font-semibold capitalize">{result.severity}</span></p>
                                  )}
                                  {result.affectedArea && (
                                    <p>• Affected Area: <span className="font-semibold">{result.affectedArea}</span></p>
                                  )}
                                  {result.deforestationArea && (
                                    <p>• Deforested Area: <span className="font-semibold">{result.deforestationArea}</span></p>
                                  )}
                                </>
                              );
                            } catch (e) {
                              return <p className="text-muted-foreground">Unable to parse results</p>;
                            }
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Detections Count */}
                    {aiAnalysis.detections && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Detections:</span>
                        <span className="font-medium">
                          {(() => {
                            try {
                              const detections = typeof aiAnalysis.detections === 'string'
                                ? JSON.parse(aiAnalysis.detections)
                                : aiAnalysis.detections;
                              return Array.isArray(detections) ? detections.length : 0;
                            } catch (e) {
                              return 0;
                            }
                          })()} objects found
                        </span>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => router.push(`/dashboard/reports/${selectedReport.data?.id}`)}
                    >
                      View Detailed Analysis
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!loadingAiAnalysis && !aiAnalysis && (
                <Card className="m-4 mt-0 border-dashed">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      No AI analysis available for this report
                    </p>
                  </CardContent>
                </Card>
              )}
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
          {/* Map Filters - Outside map container */}
          <div className="absolute top-4 right-16 bg-card border rounded-lg shadow-lg p-3 space-y-2 z-[1000]">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-semibold">Filters</span>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={ReportType.POLLUTION}>Pollution</SelectItem>
                <SelectItem value={ReportType.WILDLIFE}>Wildlife</SelectItem>
                <SelectItem value={ReportType.WATER_QUALITY}>Water Quality</SelectItem>
                <SelectItem value={ReportType.WASTE}>Waste/Dumping</SelectItem>
                <SelectItem value={ReportType.AIR_QUALITY}>Air Quality</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value={Priority.CRITICAL}>Critical</SelectItem>
                <SelectItem value={Priority.HIGH}>High</SelectItem>
                <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={Priority.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={ReportStatus.SUBMITTED}>Submitted</SelectItem>
                <SelectItem value={ReportStatus.UNDER_REVIEW}>Under Review</SelectItem>
                <SelectItem value={ReportStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={ReportStatus.RESOLVED}>Resolved</SelectItem>
                <SelectItem value={ReportStatus.DISMISSED}>Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="absolute inset-0">
            <DynamicMap
              center={mapCenter}
              zoom={mapZoom}
              markers={reports.filter(report => {
                const typeMatch = filterType === 'all' || report.data?.type === filterType;
                const priorityMatch = filterPriority === 'all' || report.data?.priority === filterPriority;
                const statusMatch = filterStatus === 'all' || report.data?.status === filterStatus;
                return typeMatch && priorityMatch && statusMatch;
              })}
              showClusters={mapView === 'cluster'}
              showHeatmap={mapView === 'heat'}
              showDrawControls={true}
              showFilters={false}
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