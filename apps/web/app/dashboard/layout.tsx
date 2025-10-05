"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/side-nav";
import { TopNav } from "@/components/layout/top-nav";
import { Toaster } from "@workspace/ui/components/sonner";
import { useUiStore } from "@/lib/stores/ui.store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <SideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main
          className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 overflow-x-hidden ${
            sidebarOpen
              ? sidebarCollapsed
                ? "lg:ml-16"
                : "lg:ml-64"
              : "lg:ml-0"
          }`}
        >
          <div className="w-full max-w-full p-6 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
