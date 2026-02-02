import { auth } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (
    pathname.startsWith('/dashboard/admin') &&
    session?.user?.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
