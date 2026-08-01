import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const params = await context.params;
  const id = params.id;
  const barber = await prisma.barber.findUnique({ where: { id } });
  if (!barber) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated = await prisma.barber.update({ where: { id }, data: { activo: !barber.activo } });
  return NextResponse.json({ barber: updated });
}
