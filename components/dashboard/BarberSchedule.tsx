"use client";

import { useState } from "react";
import { Mail, Phone, UserRound } from "lucide-react";

type Appointment = { id: string; fecha: string; hora: string; estado: string; service: { nombre: string }; usuario: { nombre: string; email: string; telefono: string | null } };

export default function BarberSchedule({ initial }: { initial: Appointment[] }) {
  const [appointments, setAppointments] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  async function action(id: string, actionName: "confirmar" | "cancelar" | "finalizar") {
    if (actionName === "cancelar" && !confirm("¿Cancelar este turno? El cliente recibirá un correo.")) return;
    const response = await fetch("/api/barber/reservas/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reservaId: id, action: actionName }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "No se pudo actualizar el turno");
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, estado: data.reserva.estado } : item));
    setMessage(actionName === "cancelar" ? "Turno cancelado y cliente notificado por email." : "Turno actualizado y cliente notificado cuando corresponde.");
  }
  if (!appointments.length) return <div className="panel p-6 text-slate-300">No tenés turnos próximos asignados.</div>;
  return <div className="space-y-3">{message && <p className="rounded-xl border border-[var(--gold)]/25 bg-[var(--gold)]/10 p-3 text-sm text-amber-100">{message}</p>}{appointments.map((appointment) => <article key={appointment.id} className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-[var(--gold)]">{new Date(appointment.fecha).toLocaleDateString("es-UY", { timeZone: "UTC" })} · {appointment.hora}</p><p className="mt-1 font-semibold text-white">{appointment.service.nombre}</p><div className="mt-3 grid gap-1 text-sm text-slate-300"><span className="inline-flex items-center gap-2"><UserRound size={15} className="text-[var(--gold)]" />{appointment.usuario.nombre}</span><span className="inline-flex items-center gap-2"><Mail size={15} className="text-[var(--gold)]" />{appointment.usuario.email}</span>{appointment.usuario.telefono && <span className="inline-flex items-center gap-2"><Phone size={15} className="text-[var(--gold)]" />{appointment.usuario.telefono}</span>}</div></div><div className="flex flex-wrap gap-2">{appointment.estado === "PENDIENTE" && <button onClick={() => void action(appointment.id, "confirmar")} className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-black">Confirmar</button>}{["PENDIENTE", "CONFIRMADA"].includes(appointment.estado) && <button onClick={() => void action(appointment.id, "cancelar")} className="rounded-lg border border-rose-400/60 px-3 py-2 text-sm text-rose-200">Cancelar</button>}{appointment.estado === "CONFIRMADA" && <button onClick={() => void action(appointment.id, "finalizar")} className="rounded-lg bg-[var(--gold)] px-3 py-2 text-sm font-medium text-black">Finalizar</button>}</div></article>)}</div>;
}
