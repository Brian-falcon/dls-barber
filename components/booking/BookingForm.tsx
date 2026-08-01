"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Service = { id: string; nombre: string; precio: number; duracion: number };
type Barber = { id: string; nombre: string };

function today() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function BookingForm() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [servicesResponse, barbersResponse] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/barbers"),
        ]);
        if (!servicesResponse.ok || !barbersResponse.ok) throw new Error();
        const [servicesData, barbersData] = await Promise.all([servicesResponse.json(), barbersResponse.json()]);
        setServices(servicesData);
        setBarbers(barbersData);
        setServiceId(servicesData[0]?.id ?? "");
        setBarberId(barbersData[0]?.id ?? "");
      } catch {
        setError("No pudimos cargar los servicios y barberos. Intentá nuevamente.");
      } finally {
        setLoading(false);
      }
    }
    void loadOptions();
  }, []);

  useEffect(() => {
    if (!serviceId || !barberId || !date) {
      return;
    }

    async function loadSlots() {
      setTime("");
      setError(null);
      try {
        const params = new URLSearchParams({ serviceId, barberId, date });
        const response = await fetch(`/api/reservas/available?${params}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setSlots(data.slots ?? []);
      } catch {
        setSlots([]);
        setError("No pudimos consultar los horarios disponibles.");
      }
    }
    void loadSlots();
  }, [serviceId, barberId, date]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (!time) {
      setError("Elegí un horario antes de confirmar.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reservas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, barberId, date, time, notas: notes }),
      });
      const data = await response.json();
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (!response.ok) throw new Error(data.error || "No se pudo crear la reserva.");
      setSuccess("Tu reserva fue enviada correctamente.");
      setTime("");
      const params = new URLSearchParams({ serviceId, barberId, date });
      const slotsResponse = await fetch(`/api/reservas/available?${params}`);
      if (slotsResponse.ok) setSlots((await slotsResponse.json()).slots ?? []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo crear la reserva.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedService = services.find((service) => service.id === serviceId);

  return (
    <section className="mx-auto max-w-3xl rounded-3xl bg-white/5 p-8 shadow-xl">
      <h2 className="mb-2 text-3xl font-semibold text-white">Reservá tu turno</h2>
      <p className="mb-6 text-slate-300">Elegí servicio, profesional, día y horario.</p>
      {loading ? <p className="text-slate-300">Cargando disponibilidad…</p> : (
        <form className="grid gap-5 text-slate-200" onSubmit={submit}>
          <label className="flex flex-col gap-2">
            Servicio
            <select value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 p-3" required>
              {services.length === 0 && <option value="">No hay servicios disponibles</option>}
              {services.map((service) => <option key={service.id} value={service.id}>{service.nombre} · {service.duracion} min · ${service.precio}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            Barbero
            <select value={barberId} onChange={(event) => setBarberId(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 p-3" required>
              {barbers.length === 0 && <option value="">No hay barberos disponibles</option>}
              {barbers.map((barber) => <option key={barber.id} value={barber.id}>{barber.nombre}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            Día
            <input value={date} onChange={(event) => setDate(event.target.value)} min={today()} className="rounded-xl border border-slate-700 bg-slate-900 p-3" type="date" required />
          </label>
          <fieldset>
            <legend className="mb-2">Horario {selectedService ? `(${selectedService.duracion} min)` : ""}</legend>
            {slots.length === 0 ? <p className="text-sm text-slate-400">No hay horarios disponibles para esta combinación.</p> : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {slots.map((slot) => <button key={slot} type="button" onClick={() => setTime(slot)} className={`rounded-xl border p-3 transition ${time === slot ? "border-[var(--gold)] bg-[var(--gold)] text-black" : "border-slate-700 hover:border-[var(--gold)]"}`}>{slot}</button>)}
              </div>
            )}
          </fieldset>
          <label className="flex flex-col gap-2">Notas para el barbero (opcional)<textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={500} rows={3} className="rounded-xl border border-slate-700 bg-slate-900 p-3" placeholder="Preferencias, corte deseado o comentarios" /></label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}
          <button type="submit" disabled={submitting || !serviceId || !barberId || !time} className="rounded-xl bg-[var(--gold)] py-3 font-bold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Confirmando…" : "Confirmar reserva"}
          </button>
        </form>
      )}
    </section>
  );
}
