import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { reservaId, action } = body;
  if (!reservaId || !action) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
  if (!reserva) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const nextStates: Record<string, string[]> = {
    PENDIENTE: ["confirmar", "cancelar"],
    CONFIRMADA: ["cancelar", "finalizar"],
    CANCELADA: [],
    FINALIZADA: [],
  };
  if (!nextStates[reserva.estado].includes(action)) {
    return NextResponse.json({ error: "La transición de estado no es válida" }, { status: 409 });
  }
  const estado = action === "confirmar" ? "CONFIRMADA" : action === "cancelar" ? "CANCELADA" : "FINALIZADA";

  const updated = await prisma.reserva.update({ where: { id: reservaId }, data: { estado } });
  return NextResponse.json({ reserva: updated });
}
