"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, telefono }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.error || "Error al crear la cuenta.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-black text-white">
      <div className="w-full max-w-lg rounded-3xl border border-[rgba(212,175,55,0.2)] bg-slate-950/95 p-10 shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-[var(--gold)]">Crear cuenta</h1>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-slate-200">
            Teléfono (opcional)
            <input value={telefono} onChange={(event) => setTelefono(event.target.value)} className="rounded-2xl bg-slate-900 border border-slate-700 p-4 text-white" type="tel" placeholder="Tu teléfono" maxLength={30} />
          </label>
          <label className="flex flex-col gap-2 text-slate-200">
            Nombre completo
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="rounded-2xl bg-slate-900 border border-slate-700 p-4 text-white"
              type="text"
              placeholder="Tu nombre"
              required
            />
          </label>
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
              minLength={8}
              required
            />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl bg-[var(--gold)] py-4 text-black font-semibold transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
