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
      if (!user.email) return "/login?error=no_email";

      const email = user.email.toLowerCase();

      try {
        const existing = await sql<{ id: string }[]>`
          SELECT id FROM users WHERE email = ${email}
        `;

        // Only allow whitelisted users
        if (existing.length === 0) {
          return "/login?error=AccessDenied";
        }

        return true; // Allowed
      } catch (error) {
        console.error("❌ SIGN-IN DB ERROR:", error);
        return "/login?error=db_error";
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
    signIn: "/login",
    error: "/login", // We handle errors with ?error= query
  },
};
