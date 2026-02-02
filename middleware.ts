// middleware.ts
import { auth } from "@/app/lib/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // check if there is a valid session
  const isLoggedIn = !!req.auth;

  // protect dashboard and admin (only require login here)
  if ((path.startsWith("/dashboard") || path.startsWith("/admin")) && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  // redirect logged-in users away from login
  if (path === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // ❌ remove role check from middleware
  // role-based access should be done in page/server or API
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
