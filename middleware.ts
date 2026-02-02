// middleware.ts
import { auth } from "@/app/lib/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  // Require login for dashboard (includes admin panel)
  if (path.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from login
  if (path === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // ❌ No role checks or DB calls here
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
