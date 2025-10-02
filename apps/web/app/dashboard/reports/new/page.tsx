"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Upload, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { ReportType, Priority, UserRole } from "@workspace/database";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/stores/auth.store";

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.nativeEnum(ReportType),
  priority: z.nativeEnum(Priority),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  incidentDate: z.string(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function NewReportPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Determine where to go back based on user role
  const getBackPath = () => {
    if (user?.role === UserRole.CITIZEN) {
      return "/dashboard/reports/my";
    }
    return "/dashboard/reports";
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      priority: Priority.MEDIUM,
      incidentDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Report created successfully");

        // Upload attachments if any
        if (attachments.length > 0) {
          try {
            const formData = new FormData();
            attachments.forEach((file) => {
              formData.append('files', file);
            });
            formData.append('reportId', result.data.id);

            const uploadResponse = await fetch("/api/photos/upload", {
              method: "POST",
              body: formData,
            });

            if (!uploadResponse.ok) {
              toast.error("Report created but failed to upload some photos");
            }
          } catch (uploadError) {
            console.error("Photo upload error:", uploadError);
            toast.error("Report created but failed to upload photos");
          }
        }

        router.push(`/dashboard/reports/${result.data.id}`);
      } else {
        toast.error(result.error || "Failed to create report");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Failed to create report");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude);
          setValue("longitude", position.coords.longitude);
          toast.success("Location obtained successfully");
        },
        (error) => {
          toast.error("Failed to get location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(getBackPath())}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Report</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details about the environmental incident
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title *</Label>
              <Input
                id="title"
                placeholder="Brief title describing the incident"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the incident..."
                rows={6}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Incident Type *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("type", value as ReportType)
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ReportType.POLLUTION}>
                      Pollution
                    </SelectItem>
                    <SelectItem value={ReportType.WILDLIFE}>
                      Wildlife
                    </SelectItem>
                    <SelectItem value={ReportType.DEFORESTATION}>
                      Deforestation
                    </SelectItem>
                    <SelectItem value={ReportType.WATER_QUALITY}>
                      Water Quality
                    </SelectItem>
                    <SelectItem value={ReportType.AIR_QUALITY}>
                      Air Quality
                    </SelectItem>
                    <SelectItem value={ReportType.NOISE}>Noise</SelectItem>
                    <SelectItem value={ReportType.WASTE}>Waste</SelectItem>
                    <SelectItem value={ReportType.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <Select
                  defaultValue={Priority.MEDIUM}
                  onValueChange={(value) =>
                    setValue("priority", value as Priority)
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Priority.CRITICAL}>
                      Critical - Immediate attention
                    </SelectItem>
                    <SelectItem value={Priority.HIGH}>High - Urgent</SelectItem>
                    <SelectItem value={Priority.MEDIUM}>
                      Medium - Standard
                    </SelectItem>
                    <SelectItem value={Priority.LOW}>
                      Low - Non-urgent
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentDate">Incident Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="incidentDate"
                  type="date"
                  className="pl-10"
                  {...register("incidentDate")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
            <CardDescription>
              Specify where the incident occurred
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location Description</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter address or landmark"
                    className="pl-10"
                    {...register("location")}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                >
                  Get Current Location
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 40.7128"
                  {...register("latitude", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g., -74.0060"
                  {...register("longitude", { valueAsNumber: true })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evidence & Attachments</CardTitle>
            <CardDescription>
              Upload photos, documents, or other evidence related to the
              incident
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                id="file-upload"
                onChange={handleFileSelect}
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" asChild>
                  <span>Select Files</span>
                </Button>
              </Label>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected files:</p>
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(getBackPath())}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Report"}
          </Button>
        </div>
      </form>
    </div>
  );
}
