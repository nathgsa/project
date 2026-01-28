// app/lib/auth.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import postgres from 'postgres';
import type { Whitelist } from './definitions';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: { email?: string | null } }) {
      if (!user?.email) return false;

      try {
        const rows = await sql<Whitelist[]>`
          SELECT id FROM whitelist WHERE email = ${user.email};
        `;
        return rows.length > 0;
      } catch (error) {
        console.error('Database error:', error);
        return false;
      }
    },

    async
