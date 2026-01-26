'use server';

import postgres from 'postgres';
import type { Whitelist } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * Check if an email is whitelisted.
 * @param email Email to check
 * @returns boolean True if email is in whitelist, false otherwise
 */
export async function isWhitelisted(email: string): Promise<boolean> {
  try {
    const rows = await sql<Whitelist[]>`
      SELECT * FROM whitelist WHERE email = ${email};
    `;
    return rows.length > 0;
  } catch (error) {
    console.error('Failed to check whitelist:', error);
    return false;
  }
}
