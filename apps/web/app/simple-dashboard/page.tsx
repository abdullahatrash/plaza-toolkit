"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SimpleDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (!response.ok) {
        router.push("/simple-login");
        return;
      }

      const data = await response.json();
      if (data.success && data.data) {
        setUser(data.data);
      } else {
        router.push("/simple-login");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      router.push("/simple-login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/simple-login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Simple Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <span className="font-semibold">Name:</span> {user?.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user?.email}
            </div>
            <div>
              <span className="font-semibold">Role:</span> {user?.role}
            </div>
            <div>
              <span className="font-semibold">Department:</span>{" "}
              {user?.department || "N/A"}
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 font-semibold">✅ Authentication Working!</p>
            <p className="text-sm text-green-600 mt-2">
              This proves your login system works. Now we can build on this foundation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
