'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { ReportType, Priority } from '@workspace/database';
import { MapPin, Loader2, Save, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

// Dynamically import map component (client-side only)
const MapPicker = dynamic(
  () => import('@/components/map/map-picker'),
  { ssr: false, loading: () => <div className="h-[400px] bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading map...</div> }
);

export default function NewReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: ReportType;
    priority: Priority;
    location: string;
    latitude: number;
    longitude: number;
    incidentDate: string;
  }>({
    title: '',
    description: '',
    type: ReportType.OTHER,
    priority: Priority.MEDIUM,
    location: '',
    latitude: 31.9539, // Default to Amman, Jordan
    longitude: 35.9106,
    incidentDate: new Date().toISOString().substring(0, 10)
  });

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);

    // Try browser geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
          }));

          // Reverse geocode to get location name
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await response.json();
            if (data.display_name) {
              setFormData(prev => ({
                ...prev,
                location: data.display_name
              }));
            }
          } catch (error) {
            console.error('Failed to reverse geocode:', error);
          }

          setIsLocating(false);
          toast.success('Location detected!');
        },
        async () => {
          // Fallback to IP-based geolocation
          console.log('Browser geolocation failed, trying IP-based location...');
          try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data.latitude && data.longitude) {
              setFormData(prev => ({
                ...prev,
                latitude: data.latitude,
                longitude: data.longitude,
                location: `${data.city}, ${data.region}, ${data.country_name}`
              }));
              toast.success('Approximate location detected from IP');
            } else {
              toast.error('Unable to determine location');
            }
          } catch (err) {
            toast.error('Location access denied or unavailable');
          }
          setIsLocating(false);
        }
      );
    } else {
      // No geolocation support, use IP-based directly
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setFormData(prev => ({
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
            location: `${data.city}, ${data.region}, ${data.country_name}`
          }));
          toast.success('Approximate location detected from IP');
        } else {
          toast.error('Unable to determine location');
        }
      } catch (err) {
        toast.error('Location service unavailable');
      }
      setIsLocating(false);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    // Reverse geocode to get location name
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();
      if (data.display_name) {
        setFormData(prev => ({
          ...prev,
          location: data.display_name
        }));
      }
    } catch (error) {
      console.error('Failed to reverse geocode:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.title.length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }
    if (formData.description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }
    if (formData.location.length < 3) {
      toast.error('Location is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Report submitted successfully!');
        router.push(`/dashboard/reports/${result.data.id}`);
      } else {
        toast.error(result.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Report</h1>
        <p className="text-muted-foreground mt-2">
          Submit a new environmental incident report
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>
              Provide information about the environmental incident
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the incident"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of what you observed..."
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Provide as much detail as possible about the incident
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as ReportType })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ReportType.POLLUTION}>🏭 Pollution</SelectItem>
                    <SelectItem value={ReportType.WILDLIFE}>🦅 Wildlife</SelectItem>
                    <SelectItem value={ReportType.WATER_QUALITY}>💧 Water Quality</SelectItem>
                    <SelectItem value={ReportType.WASTE}>🗑️ Waste/Dumping</SelectItem>
                    <SelectItem value={ReportType.DEFORESTATION}>🌲 Deforestation</SelectItem>
                    <SelectItem value={ReportType.AIR_QUALITY}>☢️ Air Quality</SelectItem>
                    <SelectItem value={ReportType.NOISE}>🔊 Noise</SelectItem>
                    <SelectItem value={ReportType.OTHER}>📍 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Priority.LOW}>Low</SelectItem>
                    <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={Priority.HIGH}>High</SelectItem>
                    <SelectItem value={Priority.CRITICAL}>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incidentDate">Incident Date</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              Click on the map to select the incident location or use your current location
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                Use Current Location
              </Button>
              <div className="flex-1">
                <Input
                  placeholder="Location address"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border">
              <MapPicker
                center={[formData.latitude, formData.longitude]}
                zoom={13}
                onMapClick={handleMapClick}
              />
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Click anywhere on the map to set the incident location
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
