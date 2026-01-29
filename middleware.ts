import { auth } from "@/app/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith("/app");

  if (!isLoggedIn && isProtected) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/app/:path*"],
};
