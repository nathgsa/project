// middleware.ts
import { auth } from "@/app/lib/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // Redirect non-logged-in users trying to access dashboard/admin
  if ((path.startsWith("/dashboard") || path.startsWith("/admin")) && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  // Only allow admins to access /admin
  if (path.startsWith("/admin") && req.auth?.user?.role !== "admin") {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // Redirect logged-in users away from /login
  if (path === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
