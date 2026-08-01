import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sendReservationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.rol !== "BARBERO") return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const profile = await prisma.barber.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!profile) return NextResponse.json({ error: "Tu cuenta aún no está vinculada a un perfil de barbero" }, { status: 409 });
  const { reservaId, action } = await request.json();
  const reservation = await prisma.reserva.findFirst({ where: { id: reservaId, barberId: profile.id } });
  if (!reservation) return NextResponse.json({ error: "Reserva inexistente" }, { status: 404 });
  if (action === "confirmar" && reservation.estado === "PENDIENTE") {
    const updated = await prisma.reserva.update({ where: { id: reservation.id }, data: { estado: "CONFIRMADA" }, include: { usuario: { select: { nombre: true, email: true } }, barber: { select: { nombre: true } }, service: { select: { nombre: true } } } });
    sendReservationEmail({ to: updated.usuario.email, name: updated.usuario.nombre, barber: updated.barber.nombre, service: updated.service.nombre, date: updated.fecha, time: updated.hora, status: "CONFIRMADA" }).catch((error) => console.error("Reservation email failed", error));
    return NextResponse.json({ reserva: updated });
  }
  if (action === "cancelar" && ["PENDIENTE", "CONFIRMADA"].includes(reservation.estado)) {
    const updated = await prisma.reserva.update({ where: { id: reservation.id }, data: { estado: "CANCELADA" }, include: { usuario: { select: { nombre: true, email: true } }, barber: { select: { nombre: true } }, service: { select: { nombre: true } } } });
    sendReservationEmail({ to: updated.usuario.email, name: updated.usuario.nombre, barber: updated.barber.nombre, service: updated.service.nombre, date: updated.fecha, time: updated.hora, status: "CANCELADA" }).catch((error) => console.error("Reservation email failed", error));
    return NextResponse.json({ reserva: updated });
  }
  if (action === "finalizar" && reservation.estado === "CONFIRMADA") {
    return NextResponse.json({ reserva: await prisma.reserva.update({ where: { id: reservation.id }, data: { estado: "FINALIZADA" } }) });
  }
  return NextResponse.json({ error: "Acción no válida para el estado actual" }, { status: 409 });
}
