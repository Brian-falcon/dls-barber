"use client";

import { useState } from "react";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const response = await fetch("/api/auth/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? "No se pudo cambiar la contraseña.");
    setCurrentPassword("");
    setNewPassword("");
    setMessage("Contraseña actualizada.");
  }

  return <form onSubmit={submit} className="mt-6 space-y-3 border-t border-gray-700 pt-5"><h4 className="font-medium text-[var(--gold)]">Seguridad</h4><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Contraseña actual" required className="w-full rounded bg-black p-2 text-sm text-white" /><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Nueva contraseña (mínimo 8)" minLength={8} required className="w-full rounded bg-black p-2 text-sm text-white" /><button className="rounded border border-[var(--gold)] px-3 py-2 text-sm text-[var(--gold)]">Actualizar contraseña</button>{message && <p className="text-sm text-gray-300">{message}</p>}</form>;
}
