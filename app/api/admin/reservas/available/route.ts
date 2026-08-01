import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/reservations";

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const url = new URL(request.url);
  const reservaId = url.searchParams.get("reservaId") || "";
  const date = url.searchParams.get("date") || "";
  if (!reservaId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const reservation = await prisma.reserva.findUnique({ where: { id: reservaId }, select: { id: true, serviceId: true, barberId: true, estado: true } });
  if (!reservation) return NextResponse.json({ error: "Reserva no disponible para reprogramar" }, { status: 404 });
  return NextResponse.json({ slots: await getAvailableSlots(reservation.serviceId, reservation.barberId, date, reservation.id) });
}
