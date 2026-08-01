import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalReservas, totalUsuarios, totalServicios, totalBarberos] = await Promise.all([
    prisma.reserva.count(),
    prisma.user.count(),
    prisma.service.count(),
    prisma.barber.count(),
  ]);
  return NextResponse.json({ totalReservas, totalUsuarios, totalServicios, totalBarberos });
}
