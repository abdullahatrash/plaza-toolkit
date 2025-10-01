'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkSession, isLoading, isAuthenticated, setLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedSession = useRef(false);
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // Check session only once on mount
    if (!hasCheckedSession.current) {
      hasCheckedSession.current = true;
      checkSession().catch((err) => {
        console.error('Session check failed:', err);
        setLoading(false);
      });

      // Timeout fallback after 5 seconds
      const timeout = setTimeout(() => {
        console.warn('⚠️ Session check timeout');
        setShowTimeout(true);
        setLoading(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only redirect after session check is complete
    if (isLoading) return;

    // Redirect to login if not authenticated and not on login page
    if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
    // Redirect to dashboard if authenticated and on login page
    else if (isAuthenticated && pathname === '/login') {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {showTimeout ? 'Loading timeout - check console' : 'Loading...'}
          </p>
          {showTimeout && (
            <button
              onClick={() => {
                setLoading(false);
                router.replace('/login');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}