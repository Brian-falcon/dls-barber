"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, MoveRight } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setIsLoading(true);
    try { const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }); const data = await response.json(); if (!response.ok) return setError(data.error || "No pudimos iniciar sesión."); router.push("/dashboard"); router.refresh(); } catch { setError("No pudimos conectar. Intentá nuevamente."); } finally { setIsLoading(false); }
  }

  return <AuthLayout eyebrow="Acceso a tu cuenta" title={<>Bienvenido de<br /><span>vuelta.</span></>} description="Ingresá para gestionar tus turnos y consultar tu actividad."><form className="auth-form" onSubmit={handleSubmit}><label className="auth-label"><span>Email</span><div className="auth-input-wrap"><Mail size={18} /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="nombre@email.com" required /></div></label><label className="auth-label"><span>Contraseña</span><div className="auth-input-wrap"><LockKeyhole size={18} /><input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Tu contraseña" required /><button type="button" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label><Link href="/recuperar-contrasena" className="auth-forgot">¿Olvidaste tu contraseña?</Link>{error && <p role="alert" className="auth-error">{error}</p>}<button type="submit" disabled={isLoading} className="auth-submit">{isLoading ? "Ingresando..." : <>Ingresar <MoveRight size={18} /></>}</button></form><p className="auth-switch">¿Todavía no tenés cuenta? <Link href="/registro">Creá tu cuenta</Link></p></AuthLayout>;
}
