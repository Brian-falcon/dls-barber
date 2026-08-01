import { redirect } from "next/navigation";
import BookingForm from "@/components/booking/BookingForm";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function ReservasPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { rol: true } });
  if (user?.rol !== "CLIENTE") redirect("/dashboard");
  return <main className="page-shell"><section className="mx-auto max-w-4xl space-y-8"><div><p className="eyebrow">Reserva online</p><h1 className="page-title">Elegí tu próximo turno</h1><p className="mt-3 max-w-2xl text-slate-300">Seleccioná servicio, profesional, día y horario. Sólo vas a poder ver y gestionar tus propias reservas.</p></div><BookingForm /></section></main>;
}
