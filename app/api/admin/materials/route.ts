import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export async function GET() {
  const materials = await sql`SELECT * FROM material ORDER BY name`;
  return NextResponse.json(materials);
}

export async function POST(req: NextRequest) {
  const { name, baseRate } = await req.json();
  const material = await sql`
    INSERT INTO material (name, baseRate)
    VALUES (${name}, ${baseRate})
    RETURNING *`;
  return NextResponse.json(material[0]);
}

export async function PUT(req: NextRequest) {
  const { id, name, baseRate } = await req.json();
  const updated = await sql`
    UPDATE material
    SET name = ${name}, baseRate = ${baseRate}
    WHERE id = ${id}
    RETURNING *`;
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM material WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
