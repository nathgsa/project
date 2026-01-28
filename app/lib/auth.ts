// app/lib/auth.ts
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

export const {
  auth,
  signIn,
  signOut,
  handlers,
} = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET, // ✅ FIXED
});

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
