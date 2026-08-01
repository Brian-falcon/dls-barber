import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createReservation, getAvailableSlots } from "@/lib/reservations";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const body = await request.json();
    const { serviceId, barberId, date, time } = body;
    if (!serviceId || !barberId || !date || !time) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    // verify slot still available
    const slots = await getAvailableSlots(serviceId, barberId, date);
    if (!slots.includes(time)) return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });

    const reserva = await createReservation({ usuarioId: session.userId, barberId, serviceId, date, time });
    return NextResponse.json({ reserva }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
