import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json();
  const { userId, rol } = body;
  if (!userId || !rol) return NextResponse.json({ error: 'Missing' }, { status: 400 });

  const user = await prisma.user.update({ where: { id: userId }, data: { rol } });
  return NextResponse.json({ user });
}
