import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const barbers = await prisma.barber.findMany({ orderBy: { nombre: 'asc' } });
  return NextResponse.json({ barbers });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const body = await request.json();
  const { nombre } = body;
  if (typeof nombre !== "string" || nombre.trim().length < 2) return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  const barber = await prisma.barber.create({ data: { nombre: nombre.trim(), activo: true } });
  revalidatePath("/");
  return NextResponse.json({ barber });
}
