import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const [totalReservas, totalUsuarios, totalServicios, totalBarberos] = await Promise.all([
    prisma.reserva.count(),
    prisma.user.count(),
    prisma.service.count(),
    prisma.barber.count(),
  ]);
  return NextResponse.json({ totalReservas, totalUsuarios, totalServicios, totalBarberos });
}
