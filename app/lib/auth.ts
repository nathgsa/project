'use server';

import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getServerSession } from 'next-auth/next';
import postgres from 'postgres';
import { Whitelist } from './definitions';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: SessionUser }) {
      if (!user?.email) return false;

      const result = await sql<Whitelist[]>`
        SELECT * FROM whitelist WHERE email = ${user.email}
      `;

      return result.length > 0; // only allow if in whitelist
    },
    async session({ session }) {
      return session;
    },
    async jwt({ token, user }: { token: any; user?: SessionUser }) {
      if (user?.email) token.id = user.email;
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return {
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
  };
}

export async function signOut({ redirectTo = '/' }: { redirectTo?: string } = {}) {
  'use server';
  redirect(redirectTo);
}
