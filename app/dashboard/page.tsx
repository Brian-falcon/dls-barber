import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ProfileCard from "@/components/dashboard/ProfileCard";
import UpcomingClient from "@/components/dashboard/UpcomingClient";
import HistoryClient from "@/components/dashboard/HistoryClient";
import BarberSchedule from "@/components/dashboard/BarberSchedule";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, nombre: true, email: true, telefono: true, rol: true } });
  if (!user) redirect("/login");

  if (user.rol === "BARBERO") {
    const barber = await prisma.barber.findUnique({ where: { userId: user.id }, select: { id: true, nombre: true } });
    const appointments = barber ? await prisma.reserva.findMany({
      where: { barberId: barber.id, estado: { in: ["PENDIENTE", "CONFIRMADA"] }, fecha: { gte: new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z") } },
      include: { service: { select: { nombre: true } }, usuario: { select: { nombre: true, email: true, telefono: true } } },
      orderBy: [{ fecha: "asc" }, { hora: "asc" }],
    }) : [];
    return <main className="page-shell"><div className="mx-auto max-w-6xl"><p className="eyebrow">Panel profesional</p><h1 className="page-title">Agenda de {barber?.nombre ?? user.nombre}</h1><div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]"><ProfileCard user={user} />{barber ? <section><h2 className="section-title">Próximos turnos</h2><BarberSchedule initial={appointments.map((appointment) => ({ ...appointment, fecha: appointment.fecha.toISOString() }))} /></section> : <section className="panel p-6"><h2 className="section-title">Perfil pendiente de asignación</h2><p className="text-slate-300">Un administrador debe vincular tu cuenta a un profesional desde Administración → Barberos.</p></section>}</div></div></main>;
  }

  if (user.rol === "ADMIN") redirect("/admin");
  const bookings = await prisma.reserva.findMany({ where: { usuarioId: user.id }, include: { barber: { select: { id: true, nombre: true } }, service: { select: { id: true, nombre: true, duracion: true } } }, orderBy: { fecha: "desc" } });
  const reservations = bookings.map((booking) => ({ id: booking.id, fecha: booking.fecha.toISOString(), hora: booking.hora, estado: booking.estado, barber: booking.barber, service: booking.service }));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = reservations.filter((reservation) => reservation.fecha.slice(0, 10) >= today && !["CANCELADA", "FINALIZADA"].includes(reservation.estado));
  const history = reservations.filter((reservation) => !upcoming.some((item) => item.id === reservation.id));
  const title = "Mi cuenta";
  return <main className="page-shell"><div className="mx-auto max-w-6xl"><p className="eyebrow">DLS Barber</p><h1 className="page-title">{title}</h1><div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]"><ProfileCard user={user} /><div className="space-y-8"><section><h2 className="section-title">Próximas reservas</h2><UpcomingClient reservas={upcoming} /></section><section><h2 className="section-title">Historial</h2><HistoryClient reservas={history} /></section></div></div></div></main>;
}
