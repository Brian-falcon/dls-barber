import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await context.params;
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, rol: true } });
  if (!user) return NextResponse.json({ error: "Usuario inexistente" }, { status: 404 });
  if (user.rol !== "CLIENTE") return NextResponse.json({ error: "Los administradores y barberos se eliminan desde su gestión correspondiente" }, { status: 409 });

  await prisma.$transaction([
    prisma.reserva.deleteMany({ where: { usuarioId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}
