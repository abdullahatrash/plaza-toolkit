import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth-middleware';

export default async function RootPage() {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    // Verify token
    const payload = await verifyToken(token);

    if (payload) {
      // User is authenticated, redirect to dashboard
      redirect('/dashboard');
    }
  }

  // User is not authenticated, redirect to login
  redirect('/login');
}
