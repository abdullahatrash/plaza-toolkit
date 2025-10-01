import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth-middleware';

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/simple-login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/session',
  '/test-map',
  '/test-login'
];

// Define role-based route access
const roleAccess: Record<string, string[]> = {
  ADMIN: ['*'], // Admin can access everything
  OFFICER: ['/dashboard', '/simple-dashboard', '/reports', '/map', '/cases', '/evidence', '/profile', '/api/*'],
  ANALYST: ['/dashboard', '/simple-dashboard', '/reports', '/map', '/analysis', '/cases', '/profile', '/api/*'],
  PROSECUTOR: ['/dashboard', '/simple-dashboard', '/cases', '/reports', '/evidence', '/profile', '/api/*'],
  CITIZEN: ['/dashboard', '/simple-dashboard', '/reports/my', '/profile', '/api/reports', '/api/auth/*']
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  // Redirect to login if no token
  if (!token) {
    console.log('⚠️ No token found for path:', pathname);
    const loginUrl = new URL('/simple-login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = await verifyToken(token);

  if (!payload) {
    // Invalid token, redirect to login
    console.log('❌ Token verification failed for path:', pathname);
    const response = NextResponse.redirect(new URL('/simple-login', request.url));
    response.cookies.delete('token');
    return response;
  }

  console.log('✅ Token valid for user:', payload.email, 'accessing:', pathname);

  // Check role-based access
  const userRole = payload.role;
  const allowedRoutes = roleAccess[userRole] || [];

  // Check if user has access to the route
  const hasAccess = allowedRoutes.includes('*') ||
    allowedRoutes.some(route => {
      if (route.includes('*')) {
        const routePrefix = route.replace('/*', '');
        return pathname.startsWith(routePrefix);
      }
      return pathname.startsWith(route);
    });

  if (!hasAccess) {
    // User doesn't have access to this route
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add user info to headers for use in server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-email', payload.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};