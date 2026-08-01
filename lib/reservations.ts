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

export async function getReservationsForBarberOnDate(barberId: string, date: string) {
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
    },
    include: { service: true },
  });
}

export async function getAvailableSlots(serviceId: string, barberId: string, date: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return [];
  const duration = service.duracion;
  const slots = await generateSlots({ serviceDuration: duration, step: 30 });

  const reservas = await getReservationsForBarberOnDate(barberId, date);

  // mark occupied slots
  const occupied = new Set<string>();
  for (const r of reservas) {
    const startMin = toMinutes(r.hora);
    const dur = r.service?.duracion ?? duration;
    const endMin = startMin + dur;
    // any slot that starts >= startMin and < endMin is blocked
    for (const s of slots) {
      const sMin = toMinutes(s);
      if (sMin >= startMin && sMin < endMin) occupied.add(s);
    }
  }

  return slots.filter((s) => !occupied.has(s));
}

export async function createReservation({ usuarioId, barberId, serviceId, date, time }:{
  usuarioId: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}) {
  const fecha = new Date(date + "T00:00:00.000Z");
  return prisma.reserva.create({
    data: {
      fecha,
      hora: time,
      usuarioId,
      barberId,
      serviceId,
      estado: "PENDIENTE",
    },
  });
}

export async function cancelReservation({ reservaId, userId }:{ reservaId:string; userId:string }){
  const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
  if (!reserva) return null;
  if (reserva.usuarioId !== userId) return null;
  return prisma.reserva.update({ where: { id: reservaId }, data: { estado: "CANCELADA" } });
}
