'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';

export default function TestMapPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Set a test user to bypass authentication
    setUser({
      id: 'test-user',
      email: 'test@plaza.gov',
      name: 'Test Officer',
      role: 'OFFICER',
      department: 'Environmental Protection'
    });

    // Redirect to map page
    router.push('/map');
  }, [setUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  );
}