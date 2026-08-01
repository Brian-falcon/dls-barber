"use client";
import React from "react";

type ReservaResumen = {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  service: { nombre: string };
  barber: { nombre: string };
};

export default function HistoryClient({ reservas }: { reservas: ReservaResumen[] }) {
  if (!reservas || reservas.length === 0) {
    return <div className="p-4 bg-gray-900 rounded border border-gray-800 text-gray-300">No hay historial.</div>;
  }

  return (
    <div className="space-y-3">
      {reservas.map((r) => (
        <div key={r.id} className="p-3 bg-gray-900 rounded border border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-300">{new Date(r.fecha).toLocaleDateString()} · {r.hora}</div>
              <div className="text-sm text-gray-200">{r.service.nombre} — {r.barber.nombre}</div>
            </div>
            <div className="text-sm text-gray-400">{r.estado}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
