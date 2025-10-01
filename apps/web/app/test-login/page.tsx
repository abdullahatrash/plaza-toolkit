'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const testLogin = async () => {
    try {
      setStatus('Logging in...');
      setError('');

      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'martinez@plaza.gov',
          password: 'password123'
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Login failed');
      }

      setStatus('Login successful! Token set. Redirecting to dashboard...');

      // Wait a moment to show the message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setStatus('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Test Login</h1>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Test credentials:</p>
          <code className="block bg-gray-100 p-2 rounded text-xs">
            Email: martinez@plaza.gov<br />
            Password: password123
          </code>
        </div>

        <button
          onClick={testLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Test Login
        </button>

        {status && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            {status}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <h2 className="text-sm font-semibold mb-2">Debug Links:</h2>
          <div className="space-y-2">
            <a href="/test-map" className="block text-blue-600 hover:underline text-sm">
              → Test Map (bypass auth)
            </a>
            <a href="/dashboard" className="block text-blue-600 hover:underline text-sm">
              → Dashboard (requires auth)
            </a>
            <a href="/login" className="block text-blue-600 hover:underline text-sm">
              → Regular Login Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}