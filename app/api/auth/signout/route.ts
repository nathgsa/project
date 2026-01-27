// app/api/auth/signout/route.ts
import { signOut } from '@/app/lib/auth';

export async function POST() {
  await signOut({ redirect: false });
  return new Response(null, { status: 200 });
}