import { sql } from "@/app/lib/db";

export async function getUsers() {
  return await sql<{ id: string, email: string, role: string, enabled: boolean }[]>`
    SELECT id, email, role, enabled FROM users ORDER BY created_at DESC
  `;
}

export async function addUser(email: string, role: "admin" | "member" = "member") {
  return await sql`
    INSERT INTO users (email, role) VALUES (${email}, ${role})
    RETURNING id, email, role, enabled
  `;
}

export async function disableUser(userId: string) {
  return await sql`
    UPDATE users SET enabled = false WHERE id = ${userId}
  `;
}

export async function enableUser(userId: string) {
  return await sql`
    UPDATE users SET enabled = true WHERE id = ${userId}
  `;
}
