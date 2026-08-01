import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const barbers = await prisma.barber.findMany({ orderBy: { nombre: 'asc' } });
  return NextResponse.json({ barbers });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const body = await request.json();
  const { nombre } = body;
  if (!nombre) return NextResponse.json({ error: 'Missing' }, { status: 400 });
  const barber = await prisma.barber.create({ data: { nombre, activo: true } });
  return NextResponse.json({ barber });
}
