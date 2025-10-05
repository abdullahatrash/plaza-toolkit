"use client";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@workspace/ui/components/timeline";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Search,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { ReportStatus } from "@workspace/database";

interface TimelineStep {
  status: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  date?: string;
}

const statusSteps: TimelineStep[] = [
  {
    status: ReportStatus.SUBMITTED,
    label: "Submitted",
    description: "Report submitted successfully",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    status: ReportStatus.UNDER_REVIEW,
    label: "Under Review",
    description: "Officer reviewing report",
    icon: <Search className="h-4 w-4" />,
  },
  {
    status: ReportStatus.IN_PROGRESS,
    label: "In Progress",
    description: "Investigation underway",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    status: ReportStatus.RESOLVED,
    label: "Resolved",
    description: "Incident resolved",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
];

interface HorizontalStatusTimelineProps {
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export function HorizontalStatusTimeline({
  currentStatus,
  createdAt,
  updatedAt,
}: HorizontalStatusTimelineProps) {
  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex(
      (step) => step.status === currentStatus
    );
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();
  const isDismissed = currentStatus === ReportStatus.DISMISSED;

  // Create timeline items with proper dates
  const timelineItems = statusSteps.map((step, index) => {
    const isPast = index < currentStepIndex;
    const isCurrent = index === currentStepIndex;
    const isFuture = index > currentStepIndex;

    let date = "";
    if (isPast) {
      // For past steps, use a calculated date based on creation time
      const stepDate = new Date(createdAt);
      stepDate.setDate(stepDate.getDate() + index);
      date = format(stepDate, "MMM dd, yyyy");
    } else if (isCurrent) {
      date = format(new Date(updatedAt), "MMM dd, yyyy");
    } else {
      // Future steps
      const futureDate = new Date(updatedAt);
      futureDate.setDate(futureDate.getDate() + (index - currentStepIndex));
      date = format(futureDate, "MMM dd, yyyy");
    }

    return {
      id: index + 1,
      date,
      title: step.label,
      description: step.description,
      status: step.status,
      isPast,
      isCurrent,
      isFuture,
      icon: step.icon,
    };
  });

  // Add dismissed status if applicable
  if (isDismissed) {
    timelineItems.push({
      id: timelineItems.length + 1,
      date: format(new Date(updatedAt), "MMM dd"),
      title: "Dismissed",
      description: "Report has been dismissed",
      status: ReportStatus.DISMISSED,
      isPast: false,
      isCurrent: true,
      isFuture: false,
      icon: <AlertCircle className="h-4 w-4" />,
    });
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Report Status Timeline</h3>
        <p className="text-sm text-muted-foreground">
          Track the progress of your report through the investigation process
        </p>
      </div>

      <Timeline
        defaultValue={currentStepIndex + 1}
        orientation="horizontal"
        className="w-full"
      >
        {timelineItems.map((item) => (
          <TimelineItem key={item.id} step={item.id}>
            <TimelineHeader>
              <TimelineSeparator />
              <TimelineDate className="text-xs font-medium">
                {item.date}
              </TimelineDate>
              <TimelineTitle
                className={`text-sm font-medium ${
                  item.isCurrent
                    ? "text-green-600 dark:text-green-400"
                    : item.isPast
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.title}
              </TimelineTitle>
              <TimelineIndicator />
            </TimelineHeader>
            <TimelineContent className="text-xs text-muted-foreground">
              {item.description}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
