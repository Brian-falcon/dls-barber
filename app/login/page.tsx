"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.error || "Error al iniciar sesión.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-black text-white">
      <div className="w-full max-w-lg rounded-3xl border border-[rgba(212,175,55,0.2)] bg-slate-950/95 p-10 shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-[var(--gold)]">Iniciar sesión</h1>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-slate-200">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl bg-slate-900 border border-slate-700 p-4 text-white"
              type="email"
              placeholder="email@ejemplo.com"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-slate-200">
            Contraseña
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl bg-slate-900 border border-slate-700 p-4 text-white"
              type="password"
              placeholder="Contraseña"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Link href="/recuperar-contrasena" className="text-right text-sm text-[var(--gold)] hover:underline">¿Olvidaste tu contraseña?</Link>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl bg-[var(--gold)] py-4 text-black font-semibold transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-300">¿No tenés cuenta? <Link href="/registro" className="text-[var(--gold)] hover:underline">Creala ahora</Link></p>
      </div>
    </main>
  );
}
