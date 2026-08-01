import { NextResponse } from "next/server";
import { hashPassword, validateEmail, validateName, validatePassword, createSessionToken, createSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, password, telefono } = body;

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios." }, { status: 400 });
    }

    if (!validateName(nombre)) {
      return NextResponse.json({ error: "El nombre debe tener al menos 2 caracteres." }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }
    if (telefono != null && (typeof telefono !== "string" || telefono.trim().length > 30)) {
      return NextResponse.json({ error: "Teléfono inválido." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado." }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        nombre: nombre.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        telefono: telefono?.trim() || null,
        rol: "CLIENTE",
      },
    });

    const token = createSessionToken(user.id, user.rol);
    const cookie = createSessionCookie(token);

    const response = NextResponse.json({ user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } }, { status: 201 });
    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno al crear la cuenta." }, { status: 500 });
  }
}
