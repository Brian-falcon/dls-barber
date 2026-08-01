import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { reservaId, action } = body;
  if (!reservaId || !action) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });
  if (!reserva) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let estado = reserva.estado;
  if (action === 'confirmar') estado = 'CONFIRMADA';
  else if (action === 'cancelar') estado = 'CANCELADA';
  else if (action === 'finalizar') estado = 'FINALIZADA';
  else return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  const updated = await prisma.reserva.update({ where: { id: reservaId }, data: { estado } });
  return NextResponse.json({ reserva: updated });
}
