'use server';
import { sql } from '@/app/lib/db';

export async function getAddons() {
  const rows = await sql`SELECT * FROM addon`;

  return {
    perSquareFoot: rows.filter(a => a.pricing_type === 'perSquareFoot'),
    perPiece: rows.filter(a => a.pricing_type === 'perPiece'),
  };
}

export async function createAddon(
  name: string,
  rate: number,
  pricingType: 'perSquareFoot' | 'perPiece'
) {
  await sql`
    INSERT INTO addon (name, rate, pricing_type)
    VALUES (${name}, ${rate}, ${pricingType})
  `;
}

export async function deleteAddon(id: string) {
  await sql`DELETE FROM addon WHERE id = ${id}`;
}
