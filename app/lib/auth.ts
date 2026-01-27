// app/lib/auth.ts
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const rows = await sql`
          SELECT id FROM whitelist WHERE email = ${user.email}
        `;
        return rows.length > 0;
      } catch (error) {
        console.error('Database error:', error);
        return false;
      }
    },

    async session({ session }) {
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}