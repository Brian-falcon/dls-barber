"use client";

import React from "react";
import { useRouter } from "next/navigation";

type UserData = { id: string; nombre?: string; email: string; rol: "CLIENTE" | "ADMIN" | "BARBERO" };

export default function UsersAdmin({ initial }: { initial: UserData[] }) {
  const router = useRouter();
  const [users, setUsers] = React.useState<UserData[]>(initial || []);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  async function changeRole(id: string, rol: UserData["rol"]) {
    setSavingId(id);
    try {
      const res = await fetch("/api/admin/users/role", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: id, rol }) });
      const data = await res.json();
      if (!res.ok) return alert(data.error ?? "No se pudo actualizar el rol");
      setUsers((prev) => prev.map((user) => user.id === id ? { ...user, rol: data.user.rol } : user));
      router.refresh();
    } finally { setSavingId(null); }
  }

  if (!users.length) return <div className="rounded border border-gray-800 bg-gray-900 p-4 text-gray-300">No hay usuarios.</div>;
  return <div className="space-y-2">{users.map((user) => <div key={user.id} className="flex items-center justify-between gap-3 rounded border border-gray-800 bg-gray-900 p-3"><div className="min-w-0"><div className="truncate text-sm text-white">{user.nombre ?? user.email}</div><div className="truncate text-sm text-gray-400">{user.email}</div></div><select disabled={savingId === user.id} value={user.rol} onChange={(event) => changeRole(user.id, event.target.value as UserData["rol"])} className="rounded border border-gray-700 bg-black p-1 text-sm text-white disabled:opacity-50"><option value="CLIENTE">CLIENTE</option><option value="BARBERO">BARBERO</option><option value="ADMIN">ADMIN</option></select></div>)}</div>;
}
