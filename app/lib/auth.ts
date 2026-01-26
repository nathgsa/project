'use server';

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getServerSession } from 'next-auth/next';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import type { Whitelist } from './definitions';

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Postgres client
const db = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: SessionUser }) {
      if (!user.email) return false;

      const result: Whitelist[] = await db<Whitelist[]>`
        SELECT * FROM whitelist WHERE email = ${user.email}
      `;

      return result.length > 0; // only allow whitelisted users
    },
    async session({ session }: { session: any }) {
      return session;
    },
    async jwt({ token, user }: { token: any; user?: SessionUser }) {
      if (user) token.id = user.email;
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
} as const;

export default NextAuth(authOptions);

// Get current user (server-side)
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return {
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
  };
}

// Sign out helper
export async function signOut({ redirectTo = '/' }: { redirectTo?: string } = {}) {
  'use server';
  redirect(redirectTo);
}
