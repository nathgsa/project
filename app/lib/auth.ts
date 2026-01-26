'use server';

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getServerSession } from 'next-auth/next';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { Whitelist } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Only allow whitelisted emails
    async signIn({ user }: { user: SessionUser }) {
      if (!user.email) return false;
      const result = await sql<Whitelist[]>`
        SELECT * FROM whitelist WHERE email = ${user.email};
      `;
      return result.length > 0; // only allow if in whitelist
    },

    async session({ session }: { session: any }) {
      return session; // available in frontend
    },

    async jwt({ token, user }: { token: any; user?: SessionUser }) {
      if (user) token.email = user.email;
      return token;
    },
  },
  pages: {
    signIn: '/login', // redirect to custom login
  },
  secret: process.env.NEXTAUTH_SECRET,
} as const;

export default NextAuth(authOptions);

// Get currently logged-in user server-side
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return {
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
  };
}

// Sign out user (server-side)
export async function signOut({ redirectTo = '/' }: { redirectTo?: string } = {}) {
  'use server';
  // NextAuth handles cookies automatically, just redirect
  redirect(redirectTo);
}
