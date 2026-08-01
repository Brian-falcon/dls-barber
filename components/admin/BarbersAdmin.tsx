"use client";
import React from "react";

type Barber = {
  id: string;
  nombre: string;
  activo: boolean;
};

export default function BarbersAdmin({ initial }: { initial: Barber[] }) {
  const [items, setItems] = React.useState<Barber[]>(initial || []);
  const [name, setName] = React.useState("");

  async function createBarber(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/barbers', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ nombre: name }) });
      if (!res.ok) throw new Error('error');
      const data = await res.json();
      setItems(prev => [data.barber, ...prev]);
      setName('');
    } catch { alert('No se pudo crear barbero'); }
  }

  async function toggleActive(id: string) {
    try {
      const res = await fetch(`/api/admin/barbers/${id}/toggle`, { method: 'POST' });
      if (!res.ok) throw new Error('error');
      const data = await res.json();
      setItems(prev => prev.map(b => b.id === id ? data.barber : b));
    } catch {
      alert('No se pudo actualizar');
    }
  }

  return (
    <div>
      <form onSubmit={createBarber} className="mb-4 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre barbero" className="p-2 bg-black border border-gray-700 rounded flex-1" />
        <button className="px-3 py-2 bg-[#D4AF37] text-black rounded">Crear</button>
      </form>

      <div className="space-y-2">
        {items.map(b => (
          <div key={b.id} className="p-3 bg-gray-900 rounded border border-gray-800 flex justify-between items-center">
            <div>
              <div className="text-white">{b.nombre}</div>
              <div className="text-sm text-gray-400">{b.activo ? 'Activo' : 'Inactivo'}</div>
            </div>
            <div>
              <button onClick={() => toggleActive(b.id)} className="px-2 py-1 bg-yellow-600 rounded text-white text-sm">{b.activo ? 'Desactivar' : 'Activar'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
