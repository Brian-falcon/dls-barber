"use client";
import React from "react";

type ServiceData = {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
};

export default function ServicesAdmin({ initial }: { initial: ServiceData[] }) {
  const [items, setItems] = React.useState<ServiceData[]>(initial || []);
  const [name, setName] = React.useState("");
  const [dur, setDur] = React.useState(30);
  const [precio, setPrecio] = React.useState(0);

  async function createService(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/services', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ nombre: name, duracion: dur, precio }) });
      if (!res.ok) throw new Error('error');
      const data = await res.json();
      setItems(prev => [data.service, ...prev]);
      setName('');
      setDur(30);
      setPrecio(0);
    } catch {
      alert('No se pudo crear servicio');
    }
  }

  async function remove(id: string) {
    if (!confirm('Eliminar servicio?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('error');
      setItems(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('No se pudo eliminar');
    }
  }

  return (
    <div>
      <form onSubmit={createService} className="mb-4 flex flex-col gap-2 md:flex-row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="p-2 bg-black border border-gray-700 rounded flex-1" />
        <input type="number" value={dur} onChange={(e) => setDur(Number(e.target.value))} className="w-full p-2 bg-black border border-gray-700 rounded md:w-24" />
        <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} placeholder="Precio" className="w-full p-2 bg-black border border-gray-700 rounded md:w-28" />
        <button className="px-3 py-2 bg-[#D4AF37] text-black rounded">Crear</button>
      </form>

      <div className="space-y-2">
        {items.map(s => (
          <div key={s.id} className="p-3 bg-gray-900 rounded border border-gray-800 flex justify-between items-center">
            <div>
              <div className="text-white">{s.nombre}</div>
              <div className="text-sm text-gray-400">{s.duracion} min</div>
            </div>
            <div>
              <button onClick={() => remove(s.id)} className="px-2 py-1 bg-red-600 rounded text-white text-sm">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
