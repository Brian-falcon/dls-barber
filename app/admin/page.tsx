import React from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import AdminStats from "@/components/admin/AdminStats";
import ReservationsAdmin from "@/components/admin/ReservationsAdmin";
import UsersAdmin from "@/components/admin/UsersAdmin";
import ServicesAdmin from "@/components/admin/ServicesAdmin";
import BarbersAdmin from "@/components/admin/BarbersAdmin";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // basic admin check could be added here

  const [totalReservas, totalUsuarios, totalServicios, totalBarberos] = await Promise.all([
    prisma.reserva.count(),
    prisma.user.count(),
    prisma.service.count(),
    prisma.barber.count(),
  ]);

  const reservas = await prisma.reserva.findMany({ include: { barber: true, service: true, usuario: true }, orderBy: { fecha: 'desc' }, take: 100 });
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  const services = await prisma.service.findMany({ orderBy: { nombre: 'asc' } });
  const barbers = await prisma.barber.findMany({ orderBy: { nombre: 'asc' } });

  return (
    <main className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#D4AF37] mb-6">Admin Dashboard</h1>

        <AdminStats stats={{ totalReservas, totalUsuarios, totalServicios, totalBarberos }} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <section className="mb-6">
              <h2 className="text-xl font-medium text-[#D4AF37] mb-3">Reservas</h2>
              <ReservationsAdmin initial={reservas} />
            </section>
            <section>
              <h2 className="text-xl font-medium text-[#D4AF37] mb-3">Servicios</h2>
              <ServicesAdmin initial={services} />
            </section>
          </div>

          <div>
            <section className="mb-6">
              <h2 className="text-xl font-medium text-[#D4AF37] mb-3">Usuarios</h2>
              <UsersAdmin initial={users} />
            </section>
            <section>
              <h2 className="text-xl font-medium text-[#D4AF37] mb-3">Barberos</h2>
              <BarbersAdmin initial={barbers} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
