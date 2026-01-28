import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { isWhitelisted } from '@/app/lib/actions'; // your helper

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) return false;

      const whitelisted = await isWhitelisted(user.email);
      if (!whitelisted) {
        return false; // prevent sign-in if not whitelisted
      }
      return true;
    },
  },
};