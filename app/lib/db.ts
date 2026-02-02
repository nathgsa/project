// app/lib/db.ts
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
});

export default sql;
export { sql };
