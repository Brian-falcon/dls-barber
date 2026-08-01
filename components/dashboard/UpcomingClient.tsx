"use client";
import React from "react";

type ReservaCliente = {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  service: { nombre: string };
  barber: { nombre: string };
};

export default function UpcomingClient({ reservas }: { reservas: ReservaCliente[] }) {
  async function handleCancel(id: string) {
    if (!confirm("¿Cancelar esta reserva?")) return;
    try {
      const res = await fetch("/api/reservas/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservaId: id }),
      });
      if (!res.ok) throw new Error("Error");
      // reload to reflect changes
      window.location.reload();
    } catch {
      alert("No se pudo cancelar la reserva.");
    }
  }

  if (!reservas || reservas.length === 0) {
    return <div className="p-4 bg-gray-900 rounded border border-gray-800 text-gray-300">No tienes próximas reservas.</div>;
  }

  return (
    <div className="space-y-4">
      {reservas.map((r) => (
        <div key={r.id} className="p-4 bg-gray-900 rounded border border-gray-800 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-300">{new Date(r.fecha).toLocaleDateString()} · {r.hora}</div>
            <div className="text-md font-medium text-white">{r.service.nombre} — {r.barber.nombre}</div>
            <div className="text-sm text-gray-400">Estado: {r.estado}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleCancel(r.id)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm">Cancelar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
