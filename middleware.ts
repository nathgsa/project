// middleware.ts
import { auth } from "@/app/lib/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // is there a valid JWT session?
  const isLoggedIn = !!req.auth;

  // protect dashboard/admin
  if ((path.startsWith("/dashboard") || path.startsWith("/admin")) && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  // protect admin routes
  if (path.startsWith("/admin") && req.auth?.user?.role !== "admin") {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // redirect logged-in users away from login
  if (path === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
