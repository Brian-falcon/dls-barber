import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await context.params;
  const barber = await prisma.barber.findUnique({ where: { id }, select: { id: true, userId: true, user: { select: { rol: true } } } });
  if (!barber) return NextResponse.json({ error: "Barbero inexistente" }, { status: 404 });
  if (barber.user?.rol === "ADMIN") return NextResponse.json({ error: "No se puede eliminar la cuenta de un administrador" }, { status: 409 });

  await prisma.$transaction(async (tx) => {
    await tx.reserva.deleteMany({ where: { barberId: id } });
    await tx.barber.delete({ where: { id } });
    if (barber.userId) await tx.user.delete({ where: { id: barber.userId } });
  });
  return NextResponse.json({ ok: true });
}
