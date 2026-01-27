// app/api/seed/route.ts
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export async function GET() {
  await sql`
    CREATE TABLE IF NOT EXISTS whitelist (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL
    );
  `;

  await sql`
    INSERT INTO whitelist (email)
    VALUES ('nathaliegraceacojedo@gmail.com')
    ON CONFLICT DO NOTHING;
  `;

  return Response.json({ message: 'Whitelist table ready' });
}
