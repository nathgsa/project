// import postgres from 'postgres';
import sql from '@/app/lib/db';

export async function getUsers() {
  return await sql`
    SELECT id, name, email
    FROM users
  `;
}

