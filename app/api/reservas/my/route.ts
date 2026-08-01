import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const reservas = await prisma.reserva.findMany({
    where: { usuarioId: session.userId },
    include: { barber: true, service: true },
    orderBy: { fecha: 'desc' },
  });
  return NextResponse.json({ reservas });
}
