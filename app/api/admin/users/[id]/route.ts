import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

// PATCH /api/admin/users/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const body = await req.json();
    const disabled = body.disabled;

    if (typeof disabled !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Fetch current user session to prevent self-disable
    const sessionReq = await req.headers.get("authorization"); 
    // ⚠️ For full session check, you'd normally decode JWT or call `auth()`.
    // Here, we assume you pass the session.user.id in the request header for simplicity
    const currentUserId = sessionReq || null;

    if (currentUserId === userId) {
      return NextResponse.json({ error: "You cannot disable yourself" }, { status: 403 });
    }

    // Update user status
    const [updatedUser] = await sql<{ id: string; email: string; role: 'admin' | 'member'; disabled: boolean; created_at: string }[]>`
      UPDATE users
      SET is_active = ${!disabled}
      WHERE id = ${userId}
      RETURNING id, email, role, NOT is_active AS disabled, created_at
    `;

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
