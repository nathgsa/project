// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

// GET: return all users
export async function GET() {
  try {
    const users = await sql<{ id: string; email: string; role: "admin" | "member" }[]>`
      SELECT id, email, role FROM users ORDER BY created_at DESC
    `;
    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ GET USERS ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST: add new user
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const newUser = await sql<{ id: string }[]>`
      INSERT INTO users (email, name, role)
      VALUES (${email.toLowerCase()}, ${email.split("@")[0]}, 'member')
      RETURNING id
    `;

    return NextResponse.json({ id: newUser[0].id, email, role: "member" });
  } catch (error) {
    console.error("❌ ADD USER ERROR:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

// DELETE: remove user
export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Admins cannot delete other admins
    const targetUser = await sql<{ role: "admin" | "member" }[]>`
      SELECT role FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (!targetUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser[0].role === "admin") {
      return NextResponse.json({ error: "Cannot remove admin users" }, { status: 403 });
    }

    await sql`
      DELETE FROM users WHERE email = ${email.toLowerCase()}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE USER ERROR:", error);
    return NextResponse.json({ error: "Failed to remove user" }, { status: 500 });
  }
}
