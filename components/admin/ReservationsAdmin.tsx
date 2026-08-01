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
  usuario?: { email: string };
};

export default function ReservationsAdmin({ initial }: { initial: ReservaAdmin[] }) {
  const [items, setItems] = React.useState<ReservaAdmin[]>(initial || []);

  async function action(id: string, act: string) {
    if (!confirm(`Confirmar acción ${act} sobre la reserva?`)) return;
    try {
      const res = await fetch(`/api/admin/reservas/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservaId: id, action: act }),
      });
      if (!res.ok) throw new Error("error");
      const data = await res.json();
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, estado: data.reserva.estado } : p)));
    } catch {
      alert("No se pudo actualizar la reserva.");
    }
  }

  if (!items.length) return <div className="p-4 bg-gray-900 rounded border border-gray-800 text-gray-300">No hay reservas.</div>;

  return (
    <div className="space-y-3">
      {items.map((r) => (
        <div key={r.id} className="p-3 bg-gray-900 rounded border border-gray-800 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-300">{new Date(r.fecha).toLocaleDateString()} · {r.hora}</div>
            <div className="text-sm text-white">{r.service.nombre} — {r.barber.nombre}</div>
            <div className="text-sm text-gray-400">Usuario: {r.usuario?.email ?? r.usuarioId}</div>
          </div>
          <div className="flex items-center gap-2">
            {r.estado !== 'CONFIRMADA' && <button onClick={() => action(r.id, 'confirmar')} className="px-2 py-1 bg-green-600 rounded text-white text-sm">Confirmar</button>}
            {r.estado !== 'CANCELADA' && <button onClick={() => action(r.id, 'cancelar')} className="px-2 py-1 bg-red-600 rounded text-white text-sm">Cancelar</button>}
            {r.estado !== 'FINALIZADA' && <button onClick={() => action(r.id, 'finalizar')} className="px-2 py-1 bg-yellow-600 rounded text-white text-sm">Finalizar</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
