import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export async function GET() {
  const perSquareFoot = await sql`SELECT id, name, persquareFoot AS rate FROM addon WHERE persquareFoot IS NOT NULL ORDER BY name`;
  const perPiece = await sql`SELECT id, name, perPiece AS rate FROM addon WHERE perPiece IS NOT NULL ORDER BY name`;
  return NextResponse.json({ perSquareFoot, perPiece });
}

export async function POST(req: NextRequest) {
  const { name, type, rate } = await req.json();
  let addon;
  if (type === 'perSquareFoot') {
    addon = await sql`
      INSERT INTO addon (name, persquareFoot)
      VALUES (${name}, ${rate})
      RETURNING id, name, persquareFoot AS rate`;
  } else {
    addon = await sql`
      INSERT INTO addon (name, perPiece)
      VALUES (${name}, ${rate})
      RETURNING id, name, perPiece AS rate`;
  }
  return NextResponse.json(addon[0]);
}

export async function PUT(req: NextRequest) {
  const { id, name, type, rate } = await req.json();
  let updated;
  if (type === 'perSquareFoot') {
    updated = await sql`
      UPDATE addon SET name=${name}, persquareFoot=${rate}
      WHERE id=${id}
      RETURNING id, name, persquareFoot AS rate`;
  } else {
    updated = await sql`
      UPDATE addon SET name=${name}, perPiece=${rate}
      WHERE id=${id}
      RETURNING id, name, perPiece AS rate`;
  }
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM addon WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
