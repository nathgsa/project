// app/seed/route.ts
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export async function GET(req: Request) {
  return new Response(JSON.stringify({ message: "Seed API working" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
