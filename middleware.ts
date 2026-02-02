// middleware.ts
import { auth } from "@/app/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  // Protect /dashboard
  if (path.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  // Protect /admin
  if (path.startsWith("/admin") && req.auth?.user?.role !== "admin") {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // Redirect logged-in users away from /login
  if (path === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/admin/:path*"],
};
