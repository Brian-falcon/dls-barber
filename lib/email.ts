type ResetEmail = { to: string; resetUrl: string; name: string };
type ReservationEmail = { to: string; name: string; barber: string; service: string; date: Date; time: string; status: "CONFIRMADA" | "CANCELADA" | "REPROGRAMADA" };

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }
function formatDate(date: Date) { return new Intl.DateTimeFormat("es-UY", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date); }

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;

  if (brevoApiKey && brevoSenderEmail) {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevoApiKey, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { email: brevoSenderEmail, name: process.env.BREVO_SENDER_NAME || "DLS BARBER" },
        replyTo: { email: brevoSenderEmail, name: process.env.BREVO_SENDER_NAME || "DLS BARBER" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!response.ok) throw new Error("No se pudo enviar el correo.");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("El correo transaccional no está configurado.");
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject, html }) });
  if (!response.ok) throw new Error("No se pudo enviar el correo.");
}

function template(title: string, content: string) {
  return `<div style="background:#090a0b;padding:32px;font-family:Arial,sans-serif;color:#fff"><div style="max-width:560px;margin:auto;border:1px solid #d4af37;border-radius:16px;padding:32px;background:#141618"><h1 style="margin:0 0 16px;color:#d4af37">DLS BARBER</h1><h2 style="margin:0 0 16px;color:#fff">${title}</h2>${content}<p style="margin-top:24px;color:#b7bec5;font-size:14px">Podés revisar tus turnos ingresando a tu cuenta.</p></div></div>`;
}

export async function sendPasswordResetEmail({ to, resetUrl, name }: ResetEmail) {
  await sendEmail({ to, subject: "Restablecé tu contraseña de DLS BARBER", html: template("Recuperar acceso", `<p>Hola ${escapeHtml(name)}, recibimos una solicitud para restablecer tu contraseña.</p><p><a href="${resetUrl}" style="display:inline-block;background:#d4af37;color:#111;padding:14px 20px;border-radius:10px;font-weight:700;text-decoration:none">Restablecer contraseña</a></p><p style="color:#b7bec5;font-size:14px">Este enlace vence en 60 minutos. Si no solicitaste el cambio, podés ignorar este correo.</p>`) });
}

export async function sendReservationEmail({ to, name, barber, service, date, time, status }: ReservationEmail) {
  const details = `<p><strong>Servicio:</strong> ${escapeHtml(service)}<br/><strong>Profesional:</strong> ${escapeHtml(barber)}<br/><strong>Fecha:</strong> ${escapeHtml(formatDate(date))}<br/><strong>Hora:</strong> ${escapeHtml(time)}</p>`;
  const copy = status === "CONFIRMADA" ? { title: "Tu turno está confirmado", subject: "Reserva confirmada · DLS BARBER", intro: "Tu reserva fue confirmada. Te esperamos." } : status === "CANCELADA" ? { title: "Tu reserva fue cancelada", subject: "Reserva cancelada · DLS BARBER", intro: "Tu reserva fue cancelada. Podés crear un nuevo turno cuando quieras." } : { title: "Tu turno fue reprogramado", subject: "Reserva reprogramada · DLS BARBER", intro: "La fecha u horario de tu reserva fue actualizado." };
  await sendEmail({ to, subject: copy.subject, html: template(copy.title, `<p>Hola ${escapeHtml(name)}, ${copy.intro}</p>${details}`) });
}
