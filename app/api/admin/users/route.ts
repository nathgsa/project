import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { v4 as uuidv4 } from "uuid";

// Example whitelist (replace with DB query if needed)
const WHITELIST = [
  "admin@example.com",
  "member1@example.com",
  "member2@example.com",
];

export async function GET() {
  const users = await sql<{ id: string; email: string; role: 'admin' | 'member'; disabled: boolean; created_at: string }[]>`
    SELECT id, email, role, NOT is_active AS disabled, created_at
    FROM users
    ORDER BY created_at DESC
  `;
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.toLowerCase();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    // ✅ Check whitelist
    if (!WHITELIST.includes(email)) {
      return NextResponse.json({ error: "Email not whitelisted" }, { status: 403 });
    }

    // Check if user already exists
    const existing = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${email}
    `;
    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Insert new user as "member" by default
    const [newUser] = await sql<{ id: string; email: string; role: 'member'; disabled: boolean; created_at: string }[]>`
      INSERT INTO users (id, email, role)
      VALUES (${uuidv4()}, ${email}, 'member')
      RETURNING id, email, role, NOT is_active AS disabled, created_at
    `;

    return NextResponse.json(newUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}
