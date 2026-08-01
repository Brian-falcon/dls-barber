import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const params = await context.params;
  const id = params.id;
  const barber = await prisma.barber.findUnique({ where: { id } });
  if (!barber) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated = await prisma.barber.update({ where: { id }, data: { activo: !barber.activo } });
  return NextResponse.json({ barber: updated });
}
