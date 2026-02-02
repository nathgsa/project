import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { sql } from "@/app/lib/db";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();

      const result = await sql<{ role: "admin" | "member" }[]>`
        SELECT role FROM users
        WHERE email = ${email}
          AND is_active = true
      `;

      if (result.length === 0) return false;

      user.role = result[0].role;
      return true;
    },

    async jwt({ token, user }) {
      if (user?.role) token.role = user.role;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "member";
      }
      return session;
    },
  },
};
