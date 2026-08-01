import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/reservations";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.rol !== "BARBERO") return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const profile = await prisma.barber.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!profile) return NextResponse.json({ error: "Perfil de barbero no vinculado" }, { status: 409 });
  const url = new URL(request.url);
  const reservaId = url.searchParams.get("reservaId") || "";
  const date = url.searchParams.get("date") || "";
  if (!reservaId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const reservation = await prisma.reserva.findFirst({ where: { id: reservaId, barberId: profile.id }, select: { id: true, serviceId: true, barberId: true, estado: true } });
  if (!reservation || ["CANCELADA", "FINALIZADA"].includes(reservation.estado)) return NextResponse.json({ error: "Reserva no disponible para reprogramar" }, { status: 404 });
  const slots = await getAvailableSlots(reservation.serviceId, reservation.barberId, date, reservation.id);
  return NextResponse.json({ slots });
}
