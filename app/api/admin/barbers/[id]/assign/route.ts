import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await context.params;
  const { userId } = await request.json();
  if (userId !== null && typeof userId !== "string") return NextResponse.json({ error: "Usuario inválido" }, { status: 400 });

  const barber = await prisma.barber.findUnique({ where: { id } });
  if (!barber) return NextResponse.json({ error: "Barbero inexistente" }, { status: 404 });
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { rol: true } });
    if (!user || user.rol !== "BARBERO") return NextResponse.json({ error: "La cuenta debe tener rol BARBERO" }, { status: 409 });
    const assigned = await prisma.barber.findFirst({ where: { userId }, select: { id: true } });
    if (assigned && assigned.id !== id) return NextResponse.json({ error: "La cuenta ya está asignada a otro barbero" }, { status: 409 });
  }

  const updated = await prisma.barber.update({
    where: { id },
    data: { userId },
    include: { user: { select: { id: true, nombre: true, email: true } } },
  });
  return NextResponse.json({ barber: updated });
}
