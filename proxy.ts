// app/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './lib/auth';

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Only protect /dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    } catch (err) {
      console.error('Auth proxy error:', err);
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Proxy matcher for all /dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
