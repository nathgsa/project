// auth.config.ts
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

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        // Google returned no email
        return "/login?error=NoEmail";
      }

      const email = user.email.toLowerCase();

      const existing = await sql<{ id: string }[]>`
        SELECT id FROM users WHERE email = ${email}
      `;

      // Email not in your DB → redirect with custom error
      if (existing.length === 0) {
        return "/login?error=NotRegistered";
      }

      // Email is whitelisted → allow login
      return true;
    },

    async session({ session }) {
      if (!session.user?.email) return session;

      try {
        const res = await sql<{ role: "admin" | "member" }[]>`
          SELECT role FROM users WHERE email = ${session.user.email}
        `;
        session.user.role = res[0]?.role ?? "member";
      } catch (error) {
        console.error("SESSION ROLE ERROR:", error);
        session.user.role = "member";
      }

      return session;
    },

    async redirect({ baseUrl }) {
      // Always redirect to dashboard after login
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // we handle custom error via query param
  },
};
