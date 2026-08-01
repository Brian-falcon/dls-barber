import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

const genericMessage = "Si existe una cuenta con ese email, te enviamos un enlace para restablecer la contraseña.";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (typeof email !== "string" || !validateEmail(email)) return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() }, select: { id: true, nombre: true, email: true } });
    if (!user) return NextResponse.json({ message: genericMessage });

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } }),
    ]);
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")).replace(/\/$/, "");
    if (!siteUrl) throw new Error("No está configurada la URL pública.");
    await sendPasswordResetEmail({ to: user.email, name: user.nombre, resetUrl: `${siteUrl}/restablecer-contrasena?token=${encodeURIComponent(rawToken)}` });
    return NextResponse.json({ message: genericMessage });
  } catch (error) {
    console.error("Password reset request failed", error);
    return NextResponse.json({ error: "No se pudo enviar el correo. Intentá nuevamente más tarde." }, { status: 503 });
  }
}
