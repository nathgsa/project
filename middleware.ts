import { auth } from '@/app/lib/auth';
// export { default } from "next-auth/middleware";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*'],
};
