'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@workspace/ui/components/skeleton';
import type { MapContainerProps } from 'react-leaflet';
import type { Report } from '@workspace/database';

// Dynamic import of map component to avoid SSR issues
const MapComponent = dynamic(
  () => import('./map-component'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    )
  }
);

export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'report' | 'evidence' | 'alert' | 'user';
  data: any;
  priority?: string;
  status?: string;
}

interface DynamicMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  showClusters?: boolean;
  showHeatmap?: boolean;
  showDrawControls?: boolean;
  showFilters?: boolean;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onAreaSelect?: (bounds: [[number, number], [number, number]]) => void;
}

export default function DynamicMap({
  center = [40.7580, -73.9855], // Default to NYC
  zoom = 12,
  markers = [],
  showClusters = true,
  showHeatmap = false,
  showDrawControls = false,
  showFilters = true,
  height = '600px',
  onMarkerClick,
  onMapClick,
  onAreaSelect
}: DynamicMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ height }} className="w-full bg-gray-100 animate-pulse" />
    );
  }

  return (
    <MapComponent
      center={center}
      zoom={zoom}
      markers={markers}
      showClusters={showClusters}
      showHeatmap={showHeatmap}
      showDrawControls={showDrawControls}
      showFilters={showFilters}
      height={height}
      onMarkerClick={onMarkerClick}
      onMapClick={onMapClick}
      onAreaSelect={onAreaSelect}
    />
  );
}