import { prisma } from "@/lib/prisma";

function toMinutes(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

function fromMinutes(mins: number) {
  const hh = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const mm = (mins % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export async function generateSlots({
  serviceDuration = 30,
  step = 30,
  start = "10:00",
  end = "19:00",
}: {
  serviceDuration?: number;
  step?: number;
  start?: string;
  end?: string;
}) {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  const slots: string[] = [];
  for (let m = startMin; m + serviceDuration <= endMin + 0.0001; m += step) {
    slots.push(fromMinutes(m));
  }
  return slots;
}

export async function getReservationsForBarberOnDate(barberId: string, date: string, excludeReservationId?: string) {
  // date expected `YYYY-MM-DD`
  const start = new Date(date + "T00:00:00.000Z");
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return prisma.reserva.findMany({
    where: {
      barberId,
      fecha: {
        gte: start,
        lt: end,
      },
      estado: { not: "CANCELADA" },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    },
    include: { service: true },
  });
}

export async function getAvailableSlots(serviceId: string, barberId: string, date: string, excludeReservationId?: string) {
  if (!isValidDate(date)) return [];
  const [service, barber] = await Promise.all([
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.barber.findUnique({ where: { id: barberId }, select: { activo: true } }),
  ]);
  if (!service || !barber?.activo) return [];
  const duration = service.duracion;
  const slots = await generateSlots({ serviceDuration: duration, step: 30 });

  const reservas = await getReservationsForBarberOnDate(barberId, date, excludeReservationId);

  return slots.filter((slot) => {
    const now = new Date();
    const isToday = date === now.toISOString().slice(0, 10);
    const slotStart = toMinutes(slot);
    if (isToday && slotStart <= now.getHours() * 60 + now.getMinutes()) return false;
    const slotEnd = slotStart + duration;
    return !reservas.some((reservation) => {
      const reservationStart = toMinutes(reservation.hora);
      const reservationEnd = reservationStart + reservation.service.duracion;
      return slotStart < reservationEnd && reservationStart < slotEnd;
    });
  });
}

export async function createReservation({ usuarioId, barberId, serviceId, date, time, notas }:{
  usuarioId: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notas?: string;
}) {
  if (!isValidDate(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error("Fecha u horario inválido");
  }
  const fecha = new Date(date + "T00:00:00.000Z");
  return prisma.reserva.create({
    data: {
      fecha,
      hora: time,
      usuarioId,
      barberId,
      serviceId,
      notas: notas?.trim().slice(0, 500) || null,
      estado: "PENDIENTE",
    },
  });
}

export async function cancelReservation({ reservaId, userId }:{ reservaId:string; userId:string }){
  const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
  if (!reserva) return null;
  if (reserva.usuarioId !== userId) return null;
  if (reserva.estado === "CANCELADA" || reserva.estado === "FINALIZADA") return null;
  return prisma.reserva.update({ where: { id: reservaId }, data: { estado: "CANCELADA" }, include: { usuario: { select: { nombre: true, email: true } }, barber: { select: { nombre: true } }, service: { select: { nombre: true } } } });
}
