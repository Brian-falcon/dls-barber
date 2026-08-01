import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const services = await prisma.service.findMany({ orderBy: { nombre: 'asc' } });
  return NextResponse.json({ services });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const body = await request.json();
  const { nombre, duracion, precio } = body;
  if (typeof nombre !== "string" || !nombre.trim() || duracion == null || precio == null) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const durInt = Number(duracion);
  const precioFloat = Number(precio);
  if (!Number.isInteger(durInt) || durInt <= 0 || durInt > 480 || !Number.isFinite(precioFloat) || precioFloat < 0) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const service = await prisma.service.create({ data: { nombre: nombre.trim(), duracion: durInt, precio: precioFloat } });
  return NextResponse.json({ service });
}
