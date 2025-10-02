"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { AlertTriangle } from "lucide-react";
import { UserRole } from "@workspace/database";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";

// Import role-specific dashboard components
import dynamic from 'next/dynamic';

// Lazy load dashboard components
const OfficerDashboard = dynamic(() => import('@/components/dashboards/officer-dashboard').then(mod => ({ default: mod.OfficerDashboard })), {
  loading: () => <DashboardSkeleton />
});

const AnalystDashboard = dynamic(() => import('@/components/dashboards/analyst-dashboard').then(mod => ({ default: mod.AnalystDashboard })), {
  loading: () => <DashboardSkeleton />
});

const ProsecutorDashboard = dynamic(() => import('@/components/dashboards/prosecutor-dashboard').then(mod => ({ default: mod.ProsecutorDashboard })), {
  loading: () => <DashboardSkeleton />
});

const CitizenDashboard = dynamic(() => import('@/components/dashboards/citizen-dashboard').then(mod => ({ default: mod.CitizenDashboard })), {
  loading: () => <DashboardSkeleton />
});

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch session and populate auth store
      const sessionResponse = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        if (sessionData.success && sessionData.data) {
          useAuthStore.getState().setUser(sessionData.data);
        }
      }

      // Fetch dashboard data
      const response = await fetch("/api/dashboard", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertDescription>No user data available. Please try logging in again.</AlertDescription>
      </Alert>
    );
  }

  // Render role-specific dashboard
  const renderDashboard = () => {
    const commonProps = {
      data: dashboardData,
      userName: user.name
    };

    switch (user.role) {
      case UserRole.OFFICER:
        return <OfficerDashboard {...commonProps} />;

      case UserRole.ANALYST:
        return <AnalystDashboard {...commonProps} />;

      case UserRole.PROSECUTOR:
        return <ProsecutorDashboard {...commonProps} />;

      case UserRole.ADMIN:
        return <AdminDashboard {...commonProps} />;

      case UserRole.CITIZEN:
        return <CitizenDashboard {...commonProps} />;

      default:
        return (
          <Alert>
            <AlertDescription>
              Unknown user role: {user.role}. Please contact system administrator.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return <div className="space-y-6">{renderDashboard()}</div>;
}
