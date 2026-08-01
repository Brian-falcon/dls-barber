import { NextResponse } from "next/server";
import { verifyPassword, createSessionToken, createSessionCookie, validateEmail, validatePassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son obligatorios." }, { status: 400 });
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      return NextResponse.json({ error: "Credenciales inválidas." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
    }

    const isValidPassword = verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
    }

    const token = createSessionToken(user.id, user.rol);
    const cookie = createSessionCookie(token);

    const response = NextResponse.json({ user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } }, { status: 200 });
    response.cookies.set(cookie);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno al iniciar sesión." }, { status: 500 });
  }
}
