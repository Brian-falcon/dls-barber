"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function ResetPasswordForm() {
  const router = useRouter(); const searchParams = useSearchParams(); const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setError(null); if (password !== confirm) return setError("Las contraseñas no coinciden."); setLoading(true); const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) }); const data = await response.json(); setLoading(false); if (!response.ok) return setError(data.error ?? "No se pudo restablecer la contraseña."); router.push("/login?reset=ok"); }
  if (!token) return <main className="page-shell flex items-center justify-center"><div className="panel max-w-lg p-8 text-center"><h1 className="page-title">Enlace inválido</h1><Link href="/recuperar-contrasena" className="mt-5 inline-block text-[var(--gold)]">Solicitar un enlace nuevo</Link></div></main>;
  return <main className="page-shell flex items-center justify-center"><div className="panel w-full max-w-lg p-6 sm:p-10"><p className="eyebrow">Contraseña nueva</p><h1 className="page-title">Restablecé tu acceso</h1><form onSubmit={submit} className="mt-7 grid gap-4"><label className="grid gap-2 text-sm text-slate-200">Nueva contraseña<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" /></label><label className="grid gap-2 text-sm text-slate-200">Repetir contraseña<input required minLength={8} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" /></label>{error && <p className="text-sm text-rose-300">{error}</p>}<button disabled={loading} className="rounded-xl bg-[var(--gold)] px-4 py-3 font-semibold text-black disabled:opacity-50">{loading ? "Guardando..." : "Actualizar contraseña"}</button></form></div></main>;
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="page-shell" />}><ResetPasswordForm /></Suspense>;
}
