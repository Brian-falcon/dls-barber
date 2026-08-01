import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/reservations";
import { sendReservationEmail } from "@/lib/email";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.rol !== "CLIENTE") return NextResponse.json({ error: "Sólo los clientes pueden reprogramar sus reservas" }, { status: 403 });
  try {
    const { reservaId, date, time } = await request.json();
    if (typeof reservaId !== "string" || typeof date !== "string" || typeof time !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      return NextResponse.json({ error: "Datos de reprogramación inválidos" }, { status: 400 });
    }
    const reservation = await prisma.reserva.findFirst({ where: { id: reservaId, usuarioId: user.id } });
    if (!reservation) return NextResponse.json({ error: "Reserva inexistente o no autorizada" }, { status: 404 });
    if (["CANCELADA", "FINALIZADA"].includes(reservation.estado)) return NextResponse.json({ error: "Esta reserva ya no puede reprogramarse" }, { status: 409 });
    const slots = await getAvailableSlots(reservation.serviceId, reservation.barberId, date, reservation.id);
    if (!slots.includes(time)) return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });
    const updated = await prisma.reserva.update({ where: { id: reservation.id }, data: { fecha: new Date(`${date}T00:00:00.000Z`), hora: time, estado: "PENDIENTE" }, include: { usuario: { select: { nombre: true, email: true } }, barber: { select: { nombre: true } }, service: { select: { nombre: true } } } });
    sendReservationEmail({ to: updated.usuario.email, name: updated.usuario.nombre, barber: updated.barber.nombre, service: updated.service.nombre, date: updated.fecha, time: updated.hora, status: "REPROGRAMADA" }).catch((error) => console.error("Reservation email failed", error));
    return NextResponse.json({ reserva: { ...updated, fecha: updated.fecha.toISOString() } });
  } catch {
    return NextResponse.json({ error: "No se pudo reprogramar la reserva" }, { status: 500 });
  }
}
