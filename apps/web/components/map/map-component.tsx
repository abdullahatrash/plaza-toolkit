'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl, LayerGroup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  MapPin,
  AlertTriangle,
  FileText,
  Camera,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Flame
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
  onClusterClick?: (markers: any[]) => void;
}

// Map control component for user location
function LocationControl() {
  const map = useMap();
  const controlRef = useRef<HTMLDivElement | null>(null);

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  useEffect(() => {
    if (!map || !controlRef.current) return;

    // Create custom Leaflet control
    const CustomControl = L.Control.extend({
      onAdd: function() {
        return controlRef.current!;
      }
    });

    const control = new CustomControl({ position: 'topleft' });
    control.addTo(map);

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
      control.remove();
    };
  }, [map]);

  return (
    <div ref={controlRef} className="leaflet-bar" style={{ marginTop: '80px' }}>
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
          cursor: 'pointer',
          textDecoration: 'none',
          color: '#333'
        }}
      >
        📍
      </a>
    </div>
  );
}

// Create custom icons for different report types
const createCustomIcon = (type: string, priority?: string) => {
  const colors: Record<string, string> = {
    [Priority.CRITICAL]: '#EF4444',
    [Priority.HIGH]: '#F97316',
    [Priority.MEDIUM]: '#EAB308',
    [Priority.LOW]: '#6B7280',
  };

  const icons: Record<string, string> = {
    [ReportType.POLLUTION]: '🏭',
    [ReportType.WILDLIFE]: '🦅',
    [ReportType.WATER_QUALITY]: '💧',
    [ReportType.WASTE]: '🗑️',
    [ReportType.DEFORESTATION]: '🌲',
    [ReportType.AIR_QUALITY]: '☢️',
    [ReportType.NOISE]: '🔊',
    [ReportType.OTHER]: '📍',
  };

  const color = priority ? (colors[priority] || '#6B7280') : '#6B7280';
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

// Heat map layer component
function HeatMapLayer({ markers }: { markers: any[] }) {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!map) return;

    // Wait for map to be fully loaded
    const onMapLoad = () => {
      setTimeout(() => setIsMapReady(true), 100);
    };

    map.on('load', onMapLoad);

    // Also set as ready immediately in case map is already loaded
    setTimeout(() => setIsMapReady(true), 100);

    return () => {
      map.off('load', onMapLoad);
    };
  }, [map]);

  useEffect(() => {
    if (!map || !isMapReady || markers.length === 0) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      try {
        map.removeLayer(heatLayerRef.current);
      } catch (e) {
        console.warn('Failed to remove heat layer:', e);
      }
      heatLayerRef.current = null;
    }

    // Create heat map data points [lat, lng, intensity]
    const heatPoints = markers.map(marker => {
      const intensity = marker.data?.priority === Priority.CRITICAL ? 1.0 :
                       marker.data?.priority === Priority.HIGH ? 0.7 :
                       marker.data?.priority === Priority.MEDIUM ? 0.4 : 0.2;
      return [marker.position[0], marker.position[1], intensity] as [number, number, number];
    });

    try {
      // Create and add heat layer
      const heatLayer = (L as any).heatLayer(heatPoints, {
        radius: 25,
        blur: 35,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.0: 'blue',
          0.3: 'cyan',
          0.5: 'lime',
          0.7: 'yellow',
          1.0: 'red'
        }
      });

      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    } catch (e) {
      console.error('Failed to create heat layer:', e);
    }

    return () => {
      if (heatLayerRef.current) {
        try {
          map.removeLayer(heatLayerRef.current);
        } catch (e) {
          console.warn('Failed to remove heat layer on cleanup:', e);
        }
      }
    };
  }, [map, isMapReady, markers]);

  return null;
}

// Draw controls component for area selection
function DrawControls({ onAreaSelect }: { onAreaSelect?: (bounds: [[number, number], [number, number]]) => void }) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    if (!map) return;

    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: '#e1e100',
            message: '<strong>Error:</strong> Shape edges cannot cross!'
          },
          shapeOptions: {
            color: '#3B82F6',
            weight: 2,
            fillOpacity: 0.2
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#3B82F6',
            weight: 2,
            fillOpacity: 0.2
          }
        },
        circle: {
          shapeOptions: {
            color: '#3B82F6',
            weight: 2,
            fillOpacity: 0.2
          }
        },
        marker: false,
        polyline: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });

    map.addControl(drawControl);

    // Handle shape creation
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      // Get bounds of the drawn shape
      if (layer.getBounds && onAreaSelect) {
        const bounds = layer.getBounds();
        const boundsTuple: [[number, number], [number, number]] = [
          [bounds.getSouth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()]
        ];
        onAreaSelect(boundsTuple);
      } else if (layer.getLatLng && layer.getRadius && onAreaSelect) {
        // For circles, calculate approximate bounds
        const center = layer.getLatLng();
        const radius = layer.getRadius();
        const latOffset = radius / 111320; // approximate meters to degrees
        const lngOffset = radius / (111320 * Math.cos(center.lat * Math.PI / 180));

        const boundsTuple: [[number, number], [number, number]] = [
          [center.lat - latOffset, center.lng - lngOffset],
          [center.lat + latOffset, center.lng + lngOffset]
        ];
        onAreaSelect(boundsTuple);
      }
    });

    // Handle shape deletion
    map.on(L.Draw.Event.DELETED, () => {
      // Clear selection if all shapes are deleted
      if (drawnItems.getLayers().length === 0 && onAreaSelect) {
        onAreaSelect([[-90, -180], [90, 180]]); // Reset to global bounds
      }
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
      map.off(L.Draw.Event.CREATED);
      map.off(L.Draw.Event.DELETED);
    };
  }, [map, onAreaSelect]);

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
  onAreaSelect,
  onClusterClick
}: MapComponentProps) {
  const renderMarkers = () => {
    const markerElements = markers.map((marker) => (
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

              <p className="text-xs text-muted-foreground line-clamp-2">
                {marker.data?.description || 'No description available'}
              </p>

              <div className="text-xs text-muted-foreground space-y-1">
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
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={(cluster: any) => {
          const count = cluster.getChildCount();
          let size = 'small';
          let sizeClass = 'marker-cluster-small';

          if (count > 100) {
            size = 'large';
            sizeClass = 'marker-cluster-large';
          } else if (count > 10) {
            size = 'medium';
            sizeClass = 'marker-cluster-medium';
          }

          return L.divIcon({
            html: `<div><span style="font-size: 16px; font-weight: 700;">${count}</span></div>`,
            className: `marker-cluster ${sizeClass}`,
            iconSize: L.point(40, 40)
          });
        }}
        eventHandlers={{
          clusterclick: (cluster: any) => {
            if (onClusterClick) {
              // Get all markers in the clicked cluster
              const clusterMarkers = cluster.layer.getAllChildMarkers();
              const markerData = clusterMarkers.map((m: any) => {
                // Find the original marker data
                return markers.find(fm =>
                  fm.position[0] === m.getLatLng().lat &&
                  fm.position[1] === m.getLatLng().lng
                );
              }).filter(Boolean);
              onClusterClick(markerData);
            }
          }
        }}
      >
        {markerElements}
      </MarkerClusterGroup>
    ) : (
      <>{markerElements}</>
    );
  };

  return (
    <div className="relative w-full h-full">
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

          {/* Heat map overlay layer */}
          {showHeatmap && (
            <LayersControl.Overlay checked name="Heat Map">
              <LayerGroup>
                <HeatMapLayer markers={markers} />
              </LayerGroup>
            </LayersControl.Overlay>
          )}
        </LayersControl>

        {/* Only show markers when heatmap is off */}
        {!showHeatmap && renderMarkers()}

        <LocationControl />
        <MapClickHandler onMapClick={onMapClick} />
        {showDrawControls && <DrawControls onAreaSelect={onAreaSelect} />}
      </MapContainer>
    </div>
  );
}