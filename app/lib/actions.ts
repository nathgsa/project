// 'use server';
 
// import { signIn } from '@/app/lib/auth';
// import { AuthError } from 'next-auth';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData,
// ) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'Something went wrong.';
//       }
//     }
//     throw error;
//   }
// }
'use server';

import { sql } from '@vercel/postgres';

export async function addWhitelistEmail(email: string) {
  await sql`
    INSERT INTO whitelist (email)
    VALUES (${email})
    ON CONFLICT DO NOTHING
  `;
}
