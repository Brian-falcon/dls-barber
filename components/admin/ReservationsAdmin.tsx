"use client";

import React from "react";

type ReservaAdmin = {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  usuarioId: string;
  service: { nombre: string };
  barber: { nombre: string };
  usuario?: { nombre: string; email: string; telefono?: string | null };
  notas?: string | null;
};

function dateValue(fecha: string) {
  return fecha.slice(0, 10);
}

export default function ReservationsAdmin({ initial }: { initial: ReservaAdmin[] }) {
  const [items, setItems] = React.useState<ReservaAdmin[]>(initial || []);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");

  async function action(id: string, actionName: string) {
    if (!confirm(`Confirmar acción ${actionName} sobre la reserva?`)) return;
    try {
      const response = await fetch("/api/admin/reservas/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservaId: id, action: actionName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setItems((previous) => previous.map((item) => item.id === id ? { ...item, estado: data.reserva.estado } : item));
    } catch {
      alert("No se pudo actualizar la reserva.");
    }
  }

  function beginEdit(reservation: ReservaAdmin) {
    setEditingId(reservation.id);
    setDate(dateValue(reservation.fecha));
    setTime(reservation.hora);
  }

  async function saveEdit(id: string) {
    try {
      const response = await fetch("/api/admin/reservas/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservaId: id, date, time }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setItems((previous) => previous.map((item) => item.id === id ? { ...item, fecha: data.reserva.fecha, hora: data.reserva.hora, estado: data.reserva.estado } : item));
      setEditingId(null);
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : "No se pudo reprogramar la reserva.");
    }
  }

  if (!items.length) return <div className="rounded border border-gray-800 bg-gray-900 p-4 text-gray-300">No hay reservas.</div>;

  return (
    <div className="space-y-3">
      {items.map((reservation) => (
        <div key={reservation.id} className="rounded border border-gray-800 bg-gray-900 p-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="text-sm text-gray-300">{new Date(reservation.fecha).toLocaleDateString()} · {reservation.hora}</div>
              <div className="text-sm text-white">{reservation.service.nombre} — {reservation.barber.nombre}</div>
              <div className="text-sm text-gray-300">Cliente: {reservation.usuario?.nombre ?? reservation.usuarioId}</div>
              <div className="text-sm text-gray-400">Email: {reservation.usuario?.email ?? "Sin email"}{reservation.usuario?.telefono ? ` · Tel: ${reservation.usuario.telefono}` : ""}</div>
              {reservation.notas && <div className="mt-1 text-sm text-gray-300">Notas: {reservation.notas}</div>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => beginEdit(reservation)} className="rounded bg-blue-700 px-2 py-1 text-sm text-white">Reprogramar</button>
              {reservation.estado === "PENDIENTE" && <button onClick={() => action(reservation.id, "confirmar")} className="rounded bg-green-600 px-2 py-1 text-sm text-white">Confirmar</button>}
              {["PENDIENTE", "CONFIRMADA"].includes(reservation.estado) && <button onClick={() => action(reservation.id, "cancelar")} className="rounded bg-red-600 px-2 py-1 text-sm text-white">Cancelar</button>}
              {reservation.estado === "CONFIRMADA" && <button onClick={() => action(reservation.id, "finalizar")} className="rounded bg-yellow-600 px-2 py-1 text-sm text-white">Finalizar</button>}
            </div>
          </div>
          {editingId === reservation.id && (
            <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-gray-800 pt-3">
              <label className="text-sm text-gray-300">Fecha<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="ml-2 rounded bg-black p-2 text-white" /></label>
              <label className="text-sm text-gray-300">Hora<input type="time" step="1800" value={time} onChange={(event) => setTime(event.target.value)} className="ml-2 rounded bg-black p-2 text-white" /></label>
              <button onClick={() => saveEdit(reservation.id)} className="rounded bg-[var(--gold)] px-3 py-2 text-sm font-medium text-black">Guardar</button>
              <button onClick={() => setEditingId(null)} className="rounded border border-gray-600 px-3 py-2 text-sm text-white">Cancelar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
