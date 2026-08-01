"use client";

import React from "react";

type StaffUser = { id: string; nombre: string; email: string; rol: string };
type Barber = { id: string; nombre: string; descripcion: string | null; activo: boolean; userId: string | null; user: { id: string; nombre: string; email: string } | null };

export default function BarbersAdmin({ initial, staff }: { initial: Barber[]; staff: StaffUser[] }) {
  const [items, setItems] = React.useState<Barber[]>(initial);
  const [name, setName] = React.useState("");
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function request(id: string, url: string, method: "POST" | "PATCH" | "DELETE", body?: object) {
    setBusyId(id);
    try {
      const response = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
      const data = await response.json();
      if (!response.ok) return alert(data.error ?? "No se pudo actualizar");
      return data;
    } finally { setBusyId(null); }
  }

  async function createBarber(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/barbers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: name }) });
    const data = await response.json();
    if (!response.ok) return alert(data.error ?? "No se pudo crear el profesional");
    setItems((current) => [{ ...data.barber, descripcion: null, userId: null, user: null }, ...current]);
    setName("");
  }

  async function saveProfile(barber: Barber) {
    const data = await request(barber.id, `/api/admin/barbers/${barber.id}`, "PATCH", { nombre: barber.nombre, descripcion: barber.descripcion });
    if (data?.barber) setItems((current) => current.map((item) => item.id === barber.id ? data.barber : item));
  }

  async function assign(barber: Barber, userId: string) {
    const data = await request(barber.id, `/api/admin/barbers/${barber.id}/assign`, "POST", { userId: userId || null });
    if (data?.barber) setItems((current) => current.map((item) => item.id === barber.id ? data.barber : item));
  }

  async function toggle(barber: Barber) {
    const data = await request(barber.id, `/api/admin/barbers/${barber.id}/toggle`, "POST");
    if (data?.barber) setItems((current) => current.map((item) => item.id === barber.id ? { ...item, ...data.barber } : item));
  }

  async function removeBarber(barber: Barber) {
    if (!window.confirm(`Eliminar a ${barber.nombre} también borra sus reservas y, si tiene una, su cuenta de acceso. Esta acción no se puede deshacer.`)) return;
    const data = await request(barber.id, `/api/admin/barbers/${barber.id}`, "DELETE");
    if (data?.ok) setItems((current) => current.filter((item) => item.id !== barber.id));
  }

  function changeField(id: string, field: "nombre" | "descripcion", value: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  }

  return <div className="space-y-4"><form onSubmit={createBarber} className="flex flex-col gap-2 sm:flex-row"><input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre del profesional" className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2" /><button className="rounded-xl bg-[var(--gold)] px-4 py-2 font-semibold text-black">Agregar profesional</button></form><p className="text-xs text-slate-400">El administrador puede editar la ficha, activar/desactivar, asignar una cuenta BARBERO o eliminar cada profesional. Una cuenta sólo puede pertenecer a un profesional.</p><div className="space-y-3">{items.map((barber) => { const eligibleStaff = staff.filter((user) => user.id === barber.userId || !items.some((item) => item.userId === user.id)); const disabled = busyId === barber.id; return <div key={barber.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="grid gap-3"><div className="grid gap-2 sm:grid-cols-2"><input value={barber.nombre} onChange={(event) => changeField(barber.id, "nombre", event.target.value)} className="rounded-lg border border-white/10 bg-black px-2 py-2 text-sm text-white" /><input value={barber.descripcion ?? ""} onChange={(event) => changeField(barber.id, "descripcion", event.target.value)} placeholder="Especialidad o presentación" className="rounded-lg border border-white/10 bg-black px-2 py-2 text-sm text-white" /></div><p className="text-xs text-slate-400">{barber.activo ? "Disponible en la web" : "Oculto de reservas e inicio"} · {barber.user ? barber.user.email : "Sin cuenta asignada"}</p><div className="flex flex-wrap gap-2"><select disabled={disabled} value={barber.userId ?? ""} onChange={(event) => assign(barber, event.target.value)} className="min-w-48 rounded-lg border border-white/10 bg-black px-2 py-2 text-sm text-white disabled:opacity-50"><option value="">Sin asignar</option>{eligibleStaff.map((user) => <option key={user.id} value={user.id}>{user.nombre} · {user.email}</option>)}</select><button disabled={disabled} onClick={() => saveProfile(barber)} className="rounded-lg bg-[var(--gold)] px-3 py-2 text-sm font-medium text-black disabled:opacity-50">Guardar ficha</button><button disabled={disabled} onClick={() => toggle(barber)} className="rounded-lg bg-white/10 px-3 py-2 text-sm disabled:opacity-50">{barber.activo ? "Desactivar" : "Activar"}</button><button disabled={disabled} onClick={() => removeBarber(barber)} className="rounded-lg border border-rose-500/50 px-3 py-2 text-sm text-rose-300 disabled:opacity-50">Eliminar</button></div></div></div>; })}</div></div>;
}
