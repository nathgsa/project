// auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { isWhitelisted } from '@/app/lib/actions';

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
    async signIn({ user }) {
      if (!user?.email) return false;

      const allowed = await isWhitelisted(user.email);
      return allowed;
    },
  },
};
