// app/lib/auth.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

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

  // Remove or update pages configuration
  // pages: {
  //   signIn: '/', // Now the home page is the login page
  // },

  secret: process.env.NEXTAUTH_SECRET,
});

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}