"use client";
import React from "react";

type UserData = {
  id: string;
  nombre?: string;
  email: string;
  rol: "CLIENTE" | "ADMIN" | "BARBERO";
};

export default function UsersAdmin({ initial }: { initial: UserData[] }) {
  const [users, setUsers] = React.useState<UserData[]>(initial || []);

  async function changeRole(id: string, rol: UserData["rol"]) {
    try {
      const res = await fetch(`/api/admin/users/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, rol }),
      });
      if (!res.ok) throw new Error('error');
      const data = await res.json();
      setUsers((prev) => prev.map(u => u.id === id ? { ...u, rol: data.user.rol } : u));
    } catch {
      alert('No se pudo actualizar rol');
    }
  }

  if (!users.length) return <div className="p-4 bg-gray-900 rounded border border-gray-800 text-gray-300">No hay usuarios.</div>;

  return (
    <div className="space-y-2">
      {users.map(u => (
        <div key={u.id} className="p-3 bg-gray-900 rounded border border-gray-800 flex justify-between items-center">
          <div>
            <div className="text-sm text-white">{u.nombre ?? u.email}</div>
            <div className="text-sm text-gray-400">{u.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <select value={u.rol} onChange={(e) => changeRole(u.id, e.target.value)} className="bg-black border border-gray-700 text-white p-1 rounded">
              <option value="CLIENTE">CLIENTE</option>
              <option value="ADMIN">ADMIN</option>
              <option value="BARBERO">BARBERO</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
