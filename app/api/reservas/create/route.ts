import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { createReservation, getAvailableSlots } from "@/lib/reservations";
import { prisma } from "@/lib/prisma";
import { sendReservationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (user.rol !== "CLIENTE") return NextResponse.json({ error: "Sólo los clientes pueden crear reservas" }, { status: 403 });

    const body = await request.json();
    const { serviceId, barberId, date, time, notas } = body;
    if (!serviceId || !barberId || !date || !time) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      return NextResponse.json({ error: "Fecha u horario inválido" }, { status: 400 });
    }

    // verify slot still available
    const slots = await getAvailableSlots(serviceId, barberId, date);
    if (!slots.includes(time)) return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });

    if (notas != null && typeof notas !== "string") return NextResponse.json({ error: "Notas inválidas" }, { status: 400 });
    const reserva = await createReservation({ usuarioId: user.id, barberId, serviceId, date, time, notas });
    const emailReservation = await prisma.reserva.findUnique({ where: { id: reserva.id }, include: { usuario: { select: { nombre: true, email: true } }, barber: { select: { nombre: true } }, service: { select: { nombre: true } } } });
    if (emailReservation) sendReservationEmail({ to: emailReservation.usuario.email, name: emailReservation.usuario.nombre, barber: emailReservation.barber.nombre, service: emailReservation.service.nombre, date: emailReservation.fecha, time: emailReservation.hora, status: "PENDIENTE" }).catch((error) => console.error("Reservation email failed", error));
    return NextResponse.json({ reserva }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
