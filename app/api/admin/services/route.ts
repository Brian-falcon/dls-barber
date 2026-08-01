import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { nombre: 'asc' } });
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const body = await request.json();
  const { nombre, duracion, precio } = body;
  if (!nombre || !duracion || precio == null) return NextResponse.json({ error: 'Missing' }, { status: 400 });
  const durInt = Number(duracion);
  const precioFloat = Number(precio);
  const service = await prisma.service.create({ data: { nombre, duracion: durInt, precio: precioFloat } });
  return NextResponse.json({ service });
}
