"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { CheckCircle2, Circle, Clock, FileText, Search, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ReportStatus } from "@workspace/database";

interface TimelineStep {
  status: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const statusSteps: TimelineStep[] = [
  {
    status: ReportStatus.SUBMITTED,
    label: "Submitted",
    description: "Your report has been successfully submitted",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    status: ReportStatus.UNDER_REVIEW,
    label: "Under Review",
    description: "An officer is reviewing your report",
    icon: <Search className="h-5 w-5" />,
  },
  {
    status: ReportStatus.IN_PROGRESS,
    label: "Investigation In Progress",
    description: "Active investigation is underway",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    status: ReportStatus.RESOLVED,
    label: "Resolved",
    description: "The incident has been resolved",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
];

interface StatusTimelineProps {
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
  activities?: Array<{
    id: string;
    type: string;
    action: string;
    description?: string;
    createdAt: string;
    user?: {
      name: string;
      role: string;
    };
  }>;
}

export function StatusTimeline({ currentStatus, createdAt, updatedAt, activities = [] }: StatusTimelineProps) {
  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex(step => step.status === currentStatus);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();
  const isDismissed = currentStatus === ReportStatus.DISMISSED;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Status Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline Steps */}
          <div className="relative">
            {statusSteps.map((step, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isFuture = index > currentStepIndex;
              const isLast = index === statusSteps.length - 1;

              return (
                <div key={step.status} className="relative">
                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-6 top-12 w-0.5 h-full ${
                        isPast ? "bg-green-500" : "bg-gray-300"
                      }`}
                      style={{ height: "calc(100% - 48px)" }}
                    />
                  )}

                  {/* Step */}
                  <div className="flex items-start gap-4 pb-8">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        isPast || isCurrent
                          ? "bg-green-50 border-green-500 text-green-600"
                          : "bg-gray-50 border-gray-300 text-gray-400"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isCurrent ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`font-medium ${
                            isCurrent ? "text-green-600" : isPast ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {isCurrent && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {format(new Date(updatedAt), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Dismissed Status */}
            {isDismissed && (
              <div className="relative">
                <div className="flex items-start gap-4 pb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 bg-gray-50 border-gray-400 text-gray-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">Dismissed</h4>
                      <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                        Current
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      This report has been reviewed and dismissed
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Updated: {format(new Date(updatedAt), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Log */}
          {activities.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Activity History</h4>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      {activity.description && (
                        <p className="text-gray-600">{activity.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        {activity.user && (
                          <>
                            <span>{activity.user.name}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{format(new Date(activity.createdAt), "MMM dd, yyyy 'at' h:mm a")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {!isDismissed && currentStatus !== ReportStatus.RESOLVED && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">What's Next?</h4>
              <p className="text-sm text-gray-600">
                {currentStatus === ReportStatus.SUBMITTED && (
                  <>An officer will review your report shortly and may reach out if additional information is needed.</>
                )}
                {currentStatus === ReportStatus.UNDER_REVIEW && (
                  <>Your report is being evaluated. An officer may contact you for additional details or evidence.</>
                )}
                {currentStatus === ReportStatus.IN_PROGRESS && (
                  <>An investigation is actively underway. We'll update you as significant progress is made.</>
                )}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
