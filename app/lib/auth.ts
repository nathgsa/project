// app/lib/auth.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import postgres from 'postgres';
import type { Whitelist } from './definitions';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Only allow whitelisted users
    async signIn({ user }: { user: { email?: string | null } }) {
      if (!user?.email) return false;

      const rows = await sql<Whitelist[]>`
        SELECT id FROM whitelist WHERE email = ${user.email};
      `;
      return rows.length > 0;
    },
    async session({ session }: { session: any }) {
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
};

// Export NextAuth functions
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

// Helper to get current user in server components
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
