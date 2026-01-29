// app/lib/auth.config.ts
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,       // 1 hour session timeout
    updateAge: 5 * 60,     // refresh every 5 minutes
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const whitelist = ["nathaliegraceacojedo@gmail.com"]; // exact email from Google
      const email = user.email.toLowerCase().trim();
      return whitelist.includes(email);
    },
  },
  pages: {
    error: "/login", // redirect to login on access denied
  },
};
