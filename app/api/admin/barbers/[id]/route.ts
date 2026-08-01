import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const { id } = await context.params;
  const { nombre, descripcion } = await request.json();
  if (typeof nombre !== "string" || nombre.trim().length < 2) return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  if (descripcion !== null && typeof descripcion !== "string") return NextResponse.json({ error: "Descripción inválida" }, { status: 400 });
  const barber = await prisma.barber.update({
    where: { id },
    data: { nombre: nombre.trim(), descripcion: descripcion?.trim() || null },
    include: { user: { select: { id: true, nombre: true, email: true } } },
  }).catch(() => null);
  if (!barber) return NextResponse.json({ error: "Barbero inexistente" }, { status: 404 });
  revalidatePath("/");
  return NextResponse.json({ barber });
}

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
  revalidatePath("/");
  revalidatePath("/reservas");
  return NextResponse.json({ ok: true });
}
