import React from "react";

type AdminStatsProps = {
  stats: {
    totalReservas: number;
    totalUsuarios: number;
    totalServicios: number;
    totalBarberos: number;
  };
};

export default function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-gradient-to-br from-gray-900 to-black rounded border border-gray-800">
        <div className="text-sm text-gray-400">Reservas</div>
        <div className="text-2xl font-bold text-white">{stats.totalReservas}</div>
      </div>

      <div className="p-4 bg-gradient-to-br from-gray-900 to-black rounded border border-gray-800">
        <div className="text-sm text-gray-400">Clientes</div>
        <div className="text-2xl font-bold text-white">{stats.totalUsuarios}</div>
      </div>

      <div className="p-4 bg-gradient-to-br from-gray-900 to-black rounded border border-gray-800">
        <div className="text-sm text-gray-400">Servicios</div>
        <div className="text-2xl font-bold text-white">{stats.totalServicios}</div>
      </div>

      <div className="p-4 bg-gradient-to-br from-gray-900 to-black rounded border border-gray-800">
        <div className="text-sm text-gray-400">Barberos</div>
        <div className="text-2xl font-bold text-white">{stats.totalBarberos}</div>
      </div>
    </div>
  );
}
