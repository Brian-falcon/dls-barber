"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(null); setMessage(null); const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); const data = await response.json(); setLoading(false); if (!response.ok) return setError(data.error ?? "No se pudo procesar la solicitud."); setMessage(data.message); }
  return <main className="page-shell flex items-center justify-center"><div className="panel w-full max-w-lg p-6 sm:p-10"><p className="eyebrow">Recuperar acceso</p><h1 className="page-title">¿Olvidaste tu contraseña?</h1><p className="mt-3 text-slate-300">Ingresá el email de tu cuenta y te enviaremos un enlace seguro para crear una contraseña nueva.</p><form onSubmit={submit} className="mt-7 grid gap-4"><label className="grid gap-2 text-sm text-slate-200">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 p-3 text-white" placeholder="email@ejemplo.com" /></label>{error && <p className="text-sm text-rose-300">{error}</p>}{message && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}<button disabled={loading} className="rounded-xl bg-[var(--gold)] px-4 py-3 font-semibold text-black disabled:opacity-50">{loading ? "Enviando..." : "Enviar enlace"}</button></form><p className="mt-6 text-center text-sm text-slate-300"><Link href="/login" className="text-[var(--gold)] hover:underline">Volver a iniciar sesión</Link></p></div></main>;
}
