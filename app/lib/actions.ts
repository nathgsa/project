'use server';

import postgres from 'postgres';
import type { Whitelist } from './definitions';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export async function isWhitelisted(email: string): Promise<boolean> {
  const rows = await sql<Whitelist[]>`
    SELECT id FROM whitelist WHERE email = ${email};
  `;
  return rows.length > 0;
}
