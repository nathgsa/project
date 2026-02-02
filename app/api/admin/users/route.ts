import { auth } from "@/app/lib/auth";
import { sql } from "@/app/lib/db";

// GET all users
export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "admin")
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const users = await sql<{ id: string; email: string; role: string }[]>`
    SELECT id, email, role FROM users ORDER BY email
  `;

  return new Response(JSON.stringify(users));
}

// ADD user
export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin")
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { email } = await req.json();
  await sql`
    INSERT INTO users (email, name, role) VALUES (${email}, 'No Name', 'member')
  `;

  return new Response(JSON.stringify({ success: true }));
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
