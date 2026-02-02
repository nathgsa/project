'use server';
import { sql } from '@/app/lib/db';

export async function getMaterials() {
  return sql`SELECT * FROM material ORDER BY created_at DESC`;
}

export async function createMaterial(name: string, baseRate: number) {
  await sql`
    INSERT INTO material (name, baseRate)
    VALUES (${name}, ${baseRate})
  `;
}

export async function updateMaterial(id: string, baseRate: number) {
  await sql`
    UPDATE material SET baseRate = ${baseRate}
    WHERE id = ${id}
  `;
}

export async function deleteMaterial(id: string) {
  await sql`DELETE FROM material WHERE id = ${id}`;
}
