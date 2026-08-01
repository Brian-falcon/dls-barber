"use client";

import React from "react";

type StaffUser = { id: string; nombre: string; email: string; rol: string };
type Barber = { id: string; nombre: string; activo: boolean; userId: string | null; user: { id: string; nombre: string; email: string } | null };

export default function BarbersAdmin({ initial, staff }: { initial: Barber[]; staff: StaffUser[] }) {
  const [items, setItems] = React.useState<Barber[]>(initial);
  const [name, setName] = React.useState("");
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function createBarber(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/admin/barbers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: name }) });
    const data = await response.json();
    if (!response.ok) return alert(data.error ?? "No se pudo crear el barbero");
    setItems((current) => [{ ...data.barber, userId: null, user: null }, ...current]);
    setName("");
  }

  async function update(id: string, path: string, body?: object) {
    setBusyId(id);
    try {
      const response = await fetch(path, { method: "POST", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
      const data = await response.json();
      if (!response.ok) return alert(data.error ?? "No se pudo actualizar");
      setItems((current) => current.map((barber) => barber.id === id ? data.barber : barber));
    } finally { setBusyId(null); }
  }

  async function removeBarber(barber: Barber) {
    if (!window.confirm(`Eliminar a ${barber.nombre} también borra sus reservas y, si tiene una, su cuenta de acceso. Esta acción no se puede deshacer.`)) return;
    setBusyId(barber.id);
    try {
      const response = await fetch(`/api/admin/barbers/${barber.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) return alert(data.error ?? "No se pudo eliminar el profesional");
      setItems((current) => current.filter((item) => item.id !== barber.id));
    } finally { setBusyId(null); }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={createBarber} className="flex flex-col gap-2 sm:flex-row"><input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre del profesional" className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2" /><button className="rounded-xl bg-[var(--gold)] px-4 py-2 font-semibold text-black">Agregar profesional</button></form>
      <p className="text-xs text-slate-400">Registrá la cuenta del profesional, asignale el rol BARBERO en Usuarios y luego vinculala aquí. Una cuenta sólo puede pertenecer a un profesional.</p>
      <div className="space-y-2">{items.map((barber) => {
        const eligibleStaff = staff.filter((user) => user.id === barber.userId || !items.some((item) => item.userId === user.id));
        return <div key={barber.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-white">{barber.nombre}</p><p className="text-sm text-slate-400">{barber.activo ? "Disponible" : "No disponible"} · {barber.user ? barber.user.email : "Sin cuenta asignada"}</p></div><div className="flex flex-wrap gap-2"><select disabled={busyId === barber.id} value={barber.userId ?? ""} onChange={(event) => update(barber.id, `/api/admin/barbers/${barber.id}/assign`, { userId: event.target.value || null })} className="rounded-lg border border-white/10 bg-black px-2 py-1 text-sm text-white disabled:opacity-50"><option value="">Sin asignar</option>{eligibleStaff.map((user) => <option key={user.id} value={user.id}>{user.nombre} · {user.email}</option>)}</select><button disabled={busyId === barber.id} onClick={() => update(barber.id, `/api/admin/barbers/${barber.id}/toggle`)} className="rounded-lg bg-white/10 px-3 py-1 text-sm disabled:opacity-50">{barber.activo ? "Desactivar" : "Activar"}</button><button disabled={busyId === barber.id} onClick={() => removeBarber(barber)} className="rounded-lg border border-rose-500/50 px-3 py-1 text-sm text-rose-300 disabled:opacity-50">Eliminar</button></div></div></div>;
      })}</div>
    </div>
  );
}
