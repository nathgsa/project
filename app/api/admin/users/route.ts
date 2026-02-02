// app/api/admin/users/route.ts
import { auth } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await sql`
    SELECT id, email, role FROM users ORDER BY created_at DESC
  `;
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email } = await req.json();
  await sql`
    INSERT INTO users (email, role)
    VALUES (${email}, 'member')
    ON CONFLICT (email) DO NOTHING
  `;
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json(); // ✅ parse JSON body

    if (!email) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
      });
    }

    // Delete from DB
    await sql`
      DELETE FROM users WHERE email = ${email} AND role != 'admin'
    `;

    return new Response(JSON.stringify({ message: "User removed" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to remove user" }), {
      status: 500,
    });
  }
}
