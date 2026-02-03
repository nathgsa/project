// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = req.nextUrl.pathname;
  const isLoggedIn = !!token;

  // Protect /dashboard and /admin routes
  if ((path.startsWith("/dashboard") || path.startsWith("/admin")) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Prevent logged-in users from accessing /login
  if (path === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next(); // let everything else pass
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
