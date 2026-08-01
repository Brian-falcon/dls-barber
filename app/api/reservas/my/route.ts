import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (user.rol !== "CLIENTE") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const reservas = await prisma.reserva.findMany({
    where: { usuarioId: user.id },
    include: { barber: true, service: true },
    orderBy: { fecha: 'desc' },
  });
  return NextResponse.json({ reservas });
}
