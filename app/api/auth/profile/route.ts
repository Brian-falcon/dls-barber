import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { validateEmail, validateName } from "@/lib/auth";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  try {
    const { nombre, email, telefono, avatar } = await request.json();
    if (typeof nombre !== "string" || !validateName(nombre) || typeof email !== "string" || !validateEmail(email)) return NextResponse.json({ error: "Ingresá un nombre y email válidos." }, { status: 400 });
    if (telefono != null && (typeof telefono !== "string" || telefono.length > 30)) return NextResponse.json({ error: "Teléfono inválido." }, { status: 400 });
    if (avatar != null && (typeof avatar !== "string" || !avatar.startsWith("data:image/") || avatar.length > 500_000)) return NextResponse.json({ error: "La foto debe ser una imagen de hasta 350 KB." }, { status: 400 });
    const user = await prisma.user.update({ where: { id: session.userId }, data: { nombre: nombre.trim(), email: email.trim().toLowerCase(), telefono: telefono?.trim() || null, avatar: avatar || null }, select: { id: true, nombre: true, email: true, telefono: true, avatar: true, rol: true } });
    return NextResponse.json({ user });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return NextResponse.json({ error: "Ese email ya está asociado a otra cuenta." }, { status: 409 });
    return NextResponse.json({ error: "No se pudo actualizar el perfil." }, { status: 500 });
  }
}
