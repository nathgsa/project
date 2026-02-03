// app/api/admin/users/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";

async function requireAdmin() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return session;
}

// GET: return all users
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await sql<
      { id: string; email: string; role: "admin" | "member" }[]
    >`
      SELECT id, email, role
      FROM users
      ORDER BY created_at DESC
    `;

    return NextResponse.json(users);
  } catch (error) {
    console.error("❌ GET USERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST: add new user
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const existing = await sql<{ id: string }[]>`
      SELECT id FROM users WHERE email = ${normalizedEmail}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const [newUser] = await sql<{ id: string }[]>`
      INSERT INTO users (email, name, role)
      VALUES (${normalizedEmail}, ${normalizedEmail.split("@")[0]}, 'member')
      RETURNING id
    `;

    return NextResponse.json({
      id: newUser.id,
      email: normalizedEmail,
      role: "member",
    });
  } catch (error) {
    console.error("❌ ADD USER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add user" },
      { status: 500 }
    );
  }
}

// DELETE: remove user
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const [targetUser] = await sql<
      { role: "admin" | "member" }[]
    >`
      SELECT role FROM users WHERE email = ${normalizedEmail}
    `;

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "admin") {
      return NextResponse.json(
        { error: "Cannot remove admin users" },
        { status: 403 }
      );
    }

    await sql`
      DELETE FROM users WHERE email = ${normalizedEmail}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE USER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to remove user" },
      { status: 500 }
    );
  }
}
