import { auth } from "@/app/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  // Only check login
  if (path.startsWith("/dashboard") && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }

  if (path === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

//   // redirect logged-in users away from login
//   if (path === "/login" && isLoggedIn) {
//     return Response.redirect(new URL("/dashboard", req.url));
//   }

  // ❌ Remove role check from middleware
  // Do role-based access inside your page or API route
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"], // keep it simple
};
