import { auth } from '@/app/lib/auth';
// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*'],
};

