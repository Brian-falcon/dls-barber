import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { userId, rol } = body;
  if (!userId || !["CLIENTE", "BARBERO", "ADMIN"].includes(rol)) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, rol: true } });
  if (!target) return NextResponse.json({ error: "Usuario inexistente" }, { status: 404 });
  if (target.rol === "ADMIN" && rol !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { rol: "ADMIN" } });
    if (adminCount <= 1) return NextResponse.json({ error: "Debe existir al menos un administrador" }, { status: 409 });
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: { rol },
    select: { id: true, nombre: true, email: true, telefono: true, rol: true },
  });
  if (rol !== "BARBERO") await prisma.barber.updateMany({ where: { userId }, data: { userId: null } });
  return NextResponse.json({ user });
}
