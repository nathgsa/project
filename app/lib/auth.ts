// app/lib/auth.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export const {
  auth,
  handlers,   // ✅ REQUIRED
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // 🔥 TEMP TEST (IMPORTANT)
    async signIn() {
      return true;
    },

    async session({ session }) {
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.AUTH_SECRET,
});

// Helper
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
