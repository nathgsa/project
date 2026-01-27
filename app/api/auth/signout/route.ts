// app/api/auth/signout/route.ts
import { signOut } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  await signOut({ redirect: false });
  return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL));
}