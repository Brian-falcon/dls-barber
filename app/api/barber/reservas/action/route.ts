import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.rol !== "BARBERO") return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const profile = await prisma.barber.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!profile) return NextResponse.json({ error: "Tu cuenta aún no está vinculada a un perfil de barbero" }, { status: 409 });
  const { reservaId, action } = await request.json();
  const reservation = await prisma.reserva.findFirst({ where: { id: reservaId, barberId: profile.id } });
  if (!reservation) return NextResponse.json({ error: "Reserva inexistente" }, { status: 404 });
  if (action === "confirmar" && reservation.estado === "PENDIENTE") {
    return NextResponse.json({ reserva: await prisma.reserva.update({ where: { id: reservation.id }, data: { estado: "CONFIRMADA" } }) });
  }
  if (action === "finalizar" && reservation.estado === "CONFIRMADA") {
    return NextResponse.json({ reserva: await prisma.reserva.update({ where: { id: reservation.id }, data: { estado: "FINALIZADA" } }) });
  }
  return NextResponse.json({ error: "Acción no válida para el estado actual" }, { status: 409 });
}
