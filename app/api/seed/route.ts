// import bcrypt from 'bcrypt';
// import postgres from 'postgres';
// import { users } from '@app/lib/placeholder-data';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

import { sql } from '@vercel/postgres';

export async function GET() {
  await sql`
    INSERT INTO whitelist (email)
    VALUES ('admin@gmail.com')
    ON CONFLICT DO NOTHING;
  `;

  return Response.json({ message: 'Seeded successfully' });
}
