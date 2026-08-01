"use client";
import { useState } from "react";

type Appointment = { id: string; fecha: string; hora: string; estado: string; service: { nombre: string }; usuario: { nombre: string; email: string } };

export default function BarberSchedule({ initial }: { initial: Appointment[] }) {
  const [appointments, setAppointments] = useState(initial);
  async function action(id: string, actionName: string) {
    const response = await fetch("/api/barber/reservas/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reservaId: id, action: actionName }) });
    const data = await response.json();
    if (!response.ok) return alert(data.error ?? "No se pudo actualizar el turno");
    setAppointments((current) => current.map((item) => item.id === id ? { ...item, estado: data.reserva.estado } : item));
  }
  if (!appointments.length) return <div className="panel p-6 text-slate-300">No tenés turnos próximos asignados.</div>;
  return <div className="space-y-3">{appointments.map((appointment) => <article key={appointment.id} className="panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-[var(--gold)]">{new Date(appointment.fecha).toLocaleDateString()} · {appointment.hora}</p><p className="font-semibold text-white">{appointment.service.nombre}</p><p className="text-sm text-slate-400">{appointment.usuario.nombre} · {appointment.usuario.email}</p></div><div className="flex gap-2">{appointment.estado === "PENDIENTE" && <button onClick={() => action(appointment.id, "confirmar")} className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-black">Confirmar</button>}{appointment.estado === "CONFIRMADA" && <button onClick={() => action(appointment.id, "finalizar")} className="rounded-lg bg-[var(--gold)] px-3 py-2 text-sm font-medium text-black">Finalizar</button>}</div></article>)}</div>;
}
