import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { hashPassword, validatePassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  try {
    const { currentPassword, newPassword } = await request.json();
    if (typeof currentPassword !== "string" || typeof newPassword !== "string" || !validatePassword(newPassword)) {
      return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || !verifyPassword(currentPassword, user.password)) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
    await prisma.user.update({ where: { id: user.id }, data: { password: hashPassword(newPassword) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo cambiar la contraseña" }, { status: 500 });
  }
}
