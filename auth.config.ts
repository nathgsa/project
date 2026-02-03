// app/lib/auth.config.ts
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { sql } from "@/app/lib/db";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();

      try {
        const existing = await sql<{ id: string }[]>`
          SELECT id FROM users WHERE email = ${email}
        `;

        // ❌ If not in DB, block login
        if (existing.length === 0) {
          // Returning false triggers `pages.error` redirect
          return false;
        }

        return true;
      } catch (error) {
        console.error("❌ SIGN-IN DB ERROR:", error);
        return false;
      }
    },

    async session({ session }) {
      if (!session.user?.email) return session;

      try {
        const res = await sql<{ role: "admin" | "member" }[]>`
          SELECT role FROM users WHERE email = ${session.user.email}
        `;
        session.user.role = res[0]?.role ?? "member";
      } catch (error) {
        console.error("❌ SESSION ROLE ERROR:", error);
        session.user.role = "member";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login", // login page
    error: "/login?error=AccessDenied", // error redirect for whitelist fail
  },
};
