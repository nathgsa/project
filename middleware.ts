// middleware.ts
import { auth } from "@/app/lib/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  if ((path.startsWith("/dashboard") || path.startsWith("/admin")) && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  if (path === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  return; // let everything else pass
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
