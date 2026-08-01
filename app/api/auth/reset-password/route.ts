import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (typeof token !== "string" || !token || typeof password !== "string" || !validatePassword(password)) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash }, select: { userId: true, expiresAt: true } });
    if (!resetToken || resetToken.expiresAt <= new Date()) return NextResponse.json({ error: "El enlace es inválido o venció. Solicitá uno nuevo." }, { status: 400 });
    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashPassword(password) } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } }),
    ]);
    return NextResponse.json({ message: "Contraseña actualizada. Ya podés iniciar sesión." });
  } catch (error) {
    console.error("Password reset failed", error);
    return NextResponse.json({ error: "No se pudo restablecer la contraseña." }, { status: 500 });
  }
}
