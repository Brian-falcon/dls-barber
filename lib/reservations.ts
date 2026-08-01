import { prisma } from "@/lib/prisma";

const BUSINESS_WINDOWS = [
  { start: "08:00", end: "12:30" },
  { start: "14:30", end: "19:30" },
] as const;
const SLOT_INTERVAL_MINUTES = 45;

function toMinutes(time: string) {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

function fromMinutes(mins: number) {
  const hh = Math.floor(mins / 60).toString().padStart(2, "0");
  const mm = (mins % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function montevideoParts(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Montevideo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
}

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((item) => item.type === type)?.value || "";
}

export function businessDateToday() {
  const parts = montevideoParts();
  return `${part(parts, "year")}-${part(parts, "month")}-${part(parts, "day")}`;
}

function businessNowMinutes() {
  const parts = montevideoParts();
  return Number(part(parts, "hour")) * 60 + Number(part(parts, "minute"));
}

function isSunday(date: string) {
  return new Date(`${date}T12:00:00.000Z`).getUTCDay() === 0;
}

export async function generateSlots({ serviceDuration = SLOT_INTERVAL_MINUTES }: { serviceDuration?: number } = {}) {
  return BUSINESS_WINDOWS.flatMap(({ start, end }) => {
    const slots: string[] = [];
    for (let minute = toMinutes(start); minute + serviceDuration <= toMinutes(end); minute += SLOT_INTERVAL_MINUTES) slots.push(fromMinutes(minute));
    return slots;
  });
}

export async function getReservationsForBarberOnDate(barberId: string, date: string, excludeReservationId?: string) {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return prisma.reserva.findMany({
    where: { barberId, fecha: { gte: start, lt: end }, estado: { not: "CANCELADA" }, ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}) },
    include: { service: true },
  });
}

export async function getAvailableSlots(serviceId: string, barberId: string, date: string, excludeReservationId?: string) {
  if (!isValidDate(date) || isSunday(date) || date < businessDateToday()) return [];
  const [service, barber] = await Promise.all([
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.barber.findUnique({ where: { id: barberId }, select: { activo: true } }),
  ]);
  if (!service || !barber?.activo) return [];
  const slots = await generateSlots({ serviceDuration: service.duracion });
  const reservations = await getReservationsForBarberOnDate(barberId, date, excludeReservationId);
  const nowMinutes = businessNowMinutes();

  return slots.filter((slot) => {
    const slotStart = toMinutes(slot);
    if (date === businessDateToday() && slotStart <= nowMinutes) return false;
    const slotEnd = slotStart + service.duracion;
    return !reservations.some((reservation) => {
      const reservationStart = toMinutes(reservation.hora);
      const reservationEnd = reservationStart + reservation.service.duracion;
      return slotStart < reservationEnd && reservationStart < slotEnd;
    });
  });
}

export async function createReservation({ usuarioId, barberId, serviceId, date, time, notas }: { usuarioId: string; barberId: string; serviceId: string; date: string; time: string; notas?: string }) {
  if (!isValidDate(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error("Fecha u horario invalido");
  const fecha = new Date(`${date}T00:00:00.000Z`);
  return prisma.reserva.create({ data: { fecha, hora: time, usuarioId, barberId, serviceId, notas: notas?.trim().slice(0, 500) || null, estado: "PENDIENTE" } });
}

export async function cancelReservation({ reservaId, userId }: { reservaId: string; userId: string }) {
  const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
  if (!reserva || reserva.usuarioId !== userId || reserva.estado === "CANCELADA" || reserva.estado === "FINALIZADA") return null;
  return prisma.reserva.update({ where: { id: reservaId }, data: { estado: "CANCELADA" }, include: { usuario: { select: { nombre: true, email: true } }, barber: { select: { nombre: true } }, service: { select: { nombre: true } } } });
}
