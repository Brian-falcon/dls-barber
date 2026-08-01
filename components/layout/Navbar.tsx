"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

type CurrentUser = { nombre: string; rol: "ADMIN" | "BARBERO" | "CLIENTE" };

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.ok ? response.json() : null).then((data) => setUser(data?.user ?? null)).catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsOpen(false);
    router.push("/");
    router.refresh();
  }

  const navItems = [
    { label: "Inicio", href: "/#inicio" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Barberos", href: "/#barberos" },
    ...(!user || user.rol === "CLIENTE" ? [{ label: "Reservar", href: "/reservas" }] : []),
    ...(user ? [{ label: "Mi cuenta", href: "/dashboard" }] : [{ label: "Ingresar", href: "/login" }, { label: "Crear cuenta", href: "/registro" }]),
    ...(user?.rol === "ADMIN" ? [{ label: "Administración", href: "/admin" }] : []),
  ];

  const links = (mobile = false) => <>{navItems.map((item) => <Link key={item.label} href={item.href} onClick={() => mobile && setIsOpen(false)} className={mobile ? "block rounded-2xl border border-[rgba(212,175,55,0.18)] bg-white/5 px-4 py-4 transition hover:border-[var(--gold)] hover:text-[var(--gold)]" : "transition hover:text-[var(--gold)]"}>{item.label}</Link>)}{user && <button onClick={logout} className={mobile ? "block w-full rounded-2xl border border-rose-500/50 px-4 py-4 text-left text-rose-300" : "text-rose-300 transition hover:text-rose-100"}>Salir</button>}</>;

  return <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(212,175,55,0.12)] bg-black/95 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><Link href="/" className="text-lg font-black tracking-[0.35em] uppercase text-[var(--gold)]">DLS BARBER</Link><nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.15em] text-slate-200 md:flex">{links()}</nav><button type="button" aria-label="Abrir menú" onClick={() => setIsOpen((state) => !state)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(212,175,55,0.22)] text-[var(--gold)] md:hidden">{isOpen ? <X size={22} /> : <Menu size={22} />}</button></div><AnimatePresence>{isOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-[rgba(212,175,55,0.12)] bg-black/95 md:hidden"><div className="space-y-1 px-6 py-4 text-sm uppercase tracking-[0.2em] text-slate-200">{links(true)}</div></motion.div>}</AnimatePresence></header>;
}
