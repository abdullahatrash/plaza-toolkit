'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl, LayerGroup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import {
  MapPin,
  AlertTriangle,
  FileText,
  Camera,
  Navigation,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { ReportType, ReportStatus, Priority } from '@workspace/database';
import { formatDate, formatRelativeTime } from '@workspace/lib/utils';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  markers: any[];
  showClusters: boolean;
  showHeatmap: boolean;
  showDrawControls: boolean;
  showFilters: boolean;
  height: string;
  onMarkerClick?: (marker: any) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onAreaSelect?: (bounds: [[number, number], [number, number]]) => void;
}

// Map control component for user location
function LocationControl() {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  useEffect(() => {
    map.on('locationfound', (e) => {
      const radius = e.accuracy / 2;
      L.marker(e.latlng).addTo(map)
        .bindPopup(`You are within ${radius} meters from this point`).openPopup();
      L.circle(e.latlng, radius).addTo(map);
    });

    map.on('locationerror', (e) => {
      alert('Location access denied or unavailable');
    });

    return () => {
      map.off('locationfound');
      map.off('locationerror');
    };
  }, [map]);

  return (
    <div className="leaflet-control leaflet-bar">
      <a
        href="#"
        title="Locate me"
        onClick={(e) => {
          e.preventDefault();
          handleLocate();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '34px',
          height: '34px',
          fontSize: '18px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}
      >
        📍
      </a>
    </div>
  );
}

// Create custom icons for different report types
const createCustomIcon = (type: string, priority?: string) => {
  const colors = {
    [Priority.CRITICAL]: '#EF4444',
    [Priority.HIGH]: '#F97316',
    [Priority.MEDIUM]: '#EAB308',
    [Priority.LOW]: '#6B7280',
  };

  const icons = {
    [ReportType.POLLUTION]: '🏭',
    [ReportType.WILDLIFE]: '🦅',
    [ReportType.WATER_QUALITY]: '💧',
    [ReportType.ILLEGAL_DUMPING]: '🗑️',
    [ReportType.DEFORESTATION]: '🌲',
    [ReportType.CHEMICAL_SPILL]: '☢️',
    [ReportType.NOISE]: '🔊',
    [ReportType.OTHER]: '📍',
  };

  const color = priority ? colors[priority] || '#6B7280' : '#6B7280';
  const icon = icons[type] || '📍';

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        ${icon}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
    className: 'custom-marker-icon'
  });
};

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export default function MapComponent({
  center,
  zoom,
  markers,
  showClusters,
  showHeatmap,
  showDrawControls,
  showFilters,
  height,
  onMarkerClick,
  onMapClick,
  onAreaSelect
}: MapComponentProps) {
  const [filteredMarkers, setFilteredMarkers] = useState(markers);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    let filtered = [...markers];

    if (filterType !== 'all') {
      filtered = filtered.filter(m => m.data?.type === filterType);
    }
    if (filterPriority !== 'all') {
      filtered = filtered.filter(m => m.data?.priority === filterPriority);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => m.data?.status === filterStatus);
    }

    setFilteredMarkers(filtered);
  }, [markers, filterType, filterPriority, filterStatus]);

  const renderMarkers = () => {
    const markerElements = filteredMarkers.map((marker) => (
      <Marker
        key={marker.id}
        position={marker.position}
        icon={createCustomIcon(marker.data?.type || ReportType.OTHER, marker.data?.priority)}
        eventHandlers={{
          click: () => onMarkerClick && onMarkerClick(marker)
        }}
      >
        <Popup maxWidth={300}>
          <Card className="border-0 shadow-none">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-semibold">
                {marker.data?.title || 'Unknown Report'}
              </CardTitle>
              <CardDescription className="text-xs">
                {marker.data?.reportNumber || marker.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={marker.data?.priority === Priority.CRITICAL ? 'destructive' : 'secondary'}>
                  {marker.data?.priority || 'Unknown'}
                </Badge>
                <Badge>
                  {marker.data?.status || 'Unknown'}
                </Badge>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2">
                {marker.data?.description || 'No description available'}
              </p>

              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {marker.data?.location || 'Unknown location'}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Type: {marker.data?.type || 'Unknown'}
                </div>
                {marker.data?.incidentDate && (
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {formatRelativeTime(marker.data.incidentDate)}
                  </div>
                )}
              </div>

              <Button
                size="sm"
                className="w-full text-xs"
                onClick={() => window.location.href = `/reports/${marker.data?.id || marker.id}`}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Popup>
      </Marker>
    ));

    return showClusters ? (
      <MarkerClusterGroup chunkedLoading>
        {markerElements}
      </MarkerClusterGroup>
    ) : (
      <>{markerElements}</>
    );
  };

  return (
    <div className="relative">
      {/* Map Filters */}
      {showFilters && (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-gray-600" />
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
              <SelectItem value={ReportType.ILLEGAL_DUMPING}>Illegal Dumping</SelectItem>
              <SelectItem value={ReportType.CHEMICAL_SPILL}>Chemical Spill</SelectItem>
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
              <SelectItem value={ReportStatus.INVESTIGATING}>Investigating</SelectItem>
              <SelectItem value={ReportStatus.RESOLVED}>Resolved</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-xs text-gray-500 pt-2 border-t">
            Showing {filteredMarkers.length} of {markers.length} reports
          </div>
        </div>
      )}

      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden shadow-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenTopoMap'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {renderMarkers()}

        <LocationControl />
        <MapClickHandler onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}