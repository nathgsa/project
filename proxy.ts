// app/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';

export default async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Protect dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    const session = await auth();

    if (!session?.user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
