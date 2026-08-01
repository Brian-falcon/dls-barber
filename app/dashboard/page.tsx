import React from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ProfileCard from "@/components/dashboard/ProfileCard";
import UpcomingClient from "@/components/dashboard/UpcomingClient";
import HistoryClient from "@/components/dashboard/HistoryClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  const reservasRaw = await prisma.reserva.findMany({
    where: { usuarioId: session.userId },
    include: { barber: true, service: true },
    orderBy: { fecha: "desc" },
  });

  const todayIso = new Date().toISOString().slice(0, 10);

  const reservas = reservasRaw.map((r) => ({
    id: r.id,
    fecha: r.fecha.toISOString(),
    hora: r.hora,
    estado: r.estado,
    barber: { id: r.barber.id, nombre: r.barber.nombre },
    service: { id: r.service.id, nombre: r.service.nombre, duracion: r.service.duracion },
  }));

  const upcoming = reservas.filter((r) => r.fecha.slice(0, 10) >= todayIso && r.estado !== "CANCELADA");
  const history = reservas.filter((r) => !(r.fecha.slice(0, 10) >= todayIso) || r.estado === "CANCELADA");

  return (
    <main className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#D4AF37] mb-6">Panel de Cliente</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileCard user={user} />
          </div>
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-medium text-[#D4AF37] mb-3">Próximas reservas</h2>
              <UpcomingClient reservas={upcoming} />
            </section>

            <section>
              <h2 className="text-xl font-medium text-[#D4AF37] mb-3">Historial</h2>
              <HistoryClient reservas={history} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
