import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";
import { getAvailableSlots } from "@/lib/reservations";
import { sendReservationEmail } from "@/lib/email";

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  try {
    const { reservaId, date, time } = await request.json();
    if (typeof reservaId !== "string" || typeof date !== "string" || typeof time !== "string") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      return NextResponse.json({ error: "Fecha u horario inválido" }, { status: 400 });
    }

    const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
    if (!reserva) return NextResponse.json({ error: "Reserva inexistente" }, { status: 404 });

    const slots = await getAvailableSlots(reserva.serviceId, reserva.barberId, date, reserva.id);
    if (!slots.includes(time)) return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });

    const updated = await prisma.reserva.update({
      where: { id: reserva.id },
      data: {
        fecha: new Date(`${date}T00:00:00.000Z`),
        hora: time,
        estado: reserva.estado === "CANCELADA" ? "PENDIENTE" : reserva.estado,
      }, include: { usuario: { select: { nombre: true, email: true } }, barber: { select: { nombre: true } }, service: { select: { nombre: true } } },
    });
    sendReservationEmail({ to: updated.usuario.email, name: updated.usuario.nombre, barber: updated.barber.nombre, service: updated.service.nombre, date: updated.fecha, time: updated.hora, status: "REPROGRAMADA" }).catch((error) => console.error("Reservation email failed", error));
    return NextResponse.json({ reserva: { ...updated, fecha: updated.fecha.toISOString() } });
  } catch {
    return NextResponse.json({ error: "No se pudo reprogramar la reserva" }, { status: 500 });
  }
}
