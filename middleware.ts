import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Extract the authentication token
  const sessionCookie = request.cookies.get('auth_session');
  
  // If no auth_session exists and trying to access protected paths (not /login)
  if (!sessionCookie) {
    if (!pathname.startsWith('/login')) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (token) {
        const isFan = token.role === "FAN";
        const sessionData = {
          userId: token.id || token.userId,
          role: token.role,
          email: token.email,
          firstName: token.firstName || "",
          lastName: token.lastName || "",
          clubSlug: token.clubSlug || null,
          clubId: token.clubId || null,
        };

        // Redirect back to the same page with the cookie injected
        const response = NextResponse.redirect(new URL(request.nextUrl.pathname + request.nextUrl.search, request.url));
        response.cookies.set("auth_session", JSON.stringify(sessionData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: isFan ? 60 * 60 * 24 * 365 : 60 * 60 * 24, // 1 year for fans, 1 day for admins
          path: "/",
        });
        return response;
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If already authenticated and trying to visit /login, redirect to /dashboard to resolve their workspace
  if (pathname.startsWith('/login') && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  let session: { role?: string; clubSlug?: string | null };
  try {
    session = JSON.parse(sessionCookie.value);
  } catch (error) {
    // If the token is corrupted/invalid, clear it by forcing a login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle post-login /dashboard routing dynamically based on role
  if (pathname.startsWith('/dashboard')) {
    if (session.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin-gen', request.url));
    }
    if (session.role === 'CLUB_ADMIN') {
      return NextResponse.redirect(new URL(session.clubSlug ? `/admin/${session.clubSlug}` : '/', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url)); // FAN goes to landing page
  }

  // 2. Super Admin Strict Enforcement
  if (pathname.startsWith('/admin-gen')) {
    if (session.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 3. Club Admin Strict Multi-Tenant Enforcement
  if (pathname.startsWith('/admin/')) {
    // Must be a CLUB_ADMIN
    if (session.role !== 'CLUB_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Extract the slug from the URL path: /admin/[clubSlug]/...
    const pathParts = pathname.split('/');
    const requestedSlug = pathParts[2]; // The 3rd element is the slug

    // Strictly verify that the requested URL slug matches the slug authorized in their token
    if (requestedSlug && session.clubSlug !== requestedSlug) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// 4. Matcher Scope
export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-gen/:path*',
    '/dashboard/:path*',
    '/login',
  ],
};
