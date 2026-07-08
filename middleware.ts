import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Extract the authentication token
  const sessionCookie = request.cookies.get('auth_session');
  
  // If no token exists, immediately redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let session: { role?: string; clubSlug?: string | null };
  try {
    session = JSON.parse(sessionCookie.value);
  } catch (error) {
    // If the token is corrupted/invalid, clear it by forcing a login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Super Admin Strict Enforcement
  if (pathname.startsWith('/admin-gen')) {
    if (session.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 3. Club Admin Strict Multi-Tenant Enforcement
  if (pathname.startsWith('/admin/')) {
    // Must be a CLUB_ADMIN
    if (session.role !== 'CLUB_ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Extract the slug from the URL path: /admin/[clubSlug]/...
    // Example split: "" -> "admin" -> "real-madrid" -> "settings"
    const pathParts = pathname.split('/');
    const requestedSlug = pathParts[2]; // The 3rd element is the slug

    // Strictly verify that the requested URL slug matches the slug authorized in their token
    if (requestedSlug && session.clubSlug !== requestedSlug) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// 4. Matcher Scope
export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-gen/:path*'
  ],
};
