type ResetEmail = { to: string; resetUrl: string; name: string };

export async function sendPasswordResetEmail({ to, resetUrl, name }: ResetEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("El correo transaccional no está configurado.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Restablecé tu contraseña de DLS BARBER",
      html: `<div style="background:#090a0b;padding:32px;font-family:Arial,sans-serif;color:#fff"><div style="max-width:560px;margin:auto;border:1px solid #d4af37;border-radius:16px;padding:32px;background:#141618"><h1 style="margin:0 0 16px;color:#d4af37">DLS BARBER</h1><p>Hola ${name}, recibimos una solicitud para restablecer tu contraseña.</p><p><a href="${resetUrl}" style="display:inline-block;background:#d4af37;color:#111;padding:14px 20px;border-radius:10px;font-weight:700;text-decoration:none">Restablecer contraseña</a></p><p style="color:#b7bec5;font-size:14px">Este enlace vence en 60 minutos. Si no solicitaste el cambio, podés ignorar este correo.</p></div></div>`,
    }),
  });
  if (!response.ok) throw new Error("No se pudo enviar el correo de recuperación.");
}
