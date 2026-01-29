import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export const { auth, signIn, signOut } = NextAuth(authConfig);

// export const runtime = "nodejs";
// const { handlers } = NextAuth(authConfig);

// export const { auth, signIn, signOut } = NextAuth(authConfig);
// export const GET = handlers.GET;
// export const POST = handlers.POST;
