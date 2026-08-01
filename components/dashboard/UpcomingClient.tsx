"use client";
import { useState } from "react";

type Reservation = { id: string; fecha: string; hora: string; estado: string; service: { id: string; nombre: string }; barber: { id: string; nombre: string } };

export default function UpcomingClient({ reservas }: { reservas: Reservation[] }) {
  const [items, setItems] = useState(reservas);
  const [editing, setEditing] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function cancel(id: string) {
    if (!confirm("¿Cancelar esta reserva?")) return;
    const response = await fetch("/api/reservas/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reservaId: id }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "No se pudo cancelar la reserva");
    setItems((current) => current.filter((reservation) => reservation.id !== id));
  }

  async function loadSlots(reservation: Reservation, nextDate: string) {
    setDate(nextDate);
    setTime("");
    setSlots([]);
    const params = new URLSearchParams({ serviceId: reservation.service.id, barberId: reservation.barber.id, date: nextDate });
    const response = await fetch(`/api/reservas/available?${params}`);
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "No se pudieron consultar los horarios");
    setSlots(data.slots ?? []);
  }

  async function reprogram(reservation: Reservation) {
    if (!date || !time) return setMessage("Elegí fecha y horario para reprogramar.");
    const response = await fetch("/api/reservas/update", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reservaId: reservation.id, date, time }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "No se pudo reprogramar la reserva");
    setItems((current) => current.map((item) => item.id === reservation.id ? { ...item, fecha: data.reserva.fecha, hora: data.reserva.hora, estado: data.reserva.estado } : item));
    setEditing(null);
    setMessage("Reserva reprogramada y pendiente de confirmación.");
  }

  if (!items.length) return <div className="panel p-6 text-slate-300">No tenés próximas reservas. Podés crear una desde Reservar turno.</div>;
  return <div className="space-y-3">{message && <p className="rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-sm text-amber-100">{message}</p>}{items.map((reservation) => <article key={reservation.id} className="panel p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-[var(--gold)]">{new Date(reservation.fecha).toLocaleDateString()} · {reservation.hora}</p><p className="font-semibold text-white">{reservation.service.nombre} — {reservation.barber.nombre}</p><p className="text-sm text-slate-400">Estado: {reservation.estado}</p></div><div className="flex gap-2"><button onClick={() => { setEditing(reservation.id); void loadSlots(reservation, reservation.fecha.slice(0, 10)); }} className="rounded-lg border border-[var(--gold)]/60 px-3 py-2 text-sm text-[var(--gold)]">Reprogramar</button><button onClick={() => void cancel(reservation.id)} className="rounded-lg bg-rose-500/90 px-3 py-2 text-sm font-medium text-white">Cancelar</button></div></div>{editing === reservation.id && <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 md:grid-cols-[200px_1fr_auto]"><input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(event) => void loadSlots(reservation, event.target.value)} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white" /><select value={time} onChange={(event) => setTime(event.target.value)} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white"><option value="">Elegí un horario</option>{slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select><div className="flex gap-2"><button onClick={() => void reprogram(reservation)} className="rounded-lg bg-[var(--gold)] px-3 py-2 text-sm font-semibold text-black">Guardar</button><button onClick={() => setEditing(null)} className="rounded-lg border border-white/20 px-3 py-2 text-sm">Cerrar</button></div></div>}</article>)}</div>;
}
