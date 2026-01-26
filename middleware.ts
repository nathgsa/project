// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Only allow access to /dashboard if user is logged in (simple redirect)
export function middleware(req: NextRequest) {
  const token = req.cookies.get('next-auth.session-token');

  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Match everything in /dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};
