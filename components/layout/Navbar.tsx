"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Barberos", href: "/#barberos" },
  { label: "Reservar", href: "/reservas" },
  { label: "Login", href: "/login" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(212,175,55,0.12)] bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-black tracking-[0.35em] uppercase text-[var(--gold)]">
          DLS BARBER
        </Link>

        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.2em] text-slate-200 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-[var(--gold)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setIsOpen((state) => !state)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(212,175,55,0.22)] text-[var(--gold)] transition hover:bg-[rgba(212,175,55,0.08)] md:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[rgba(212,175,55,0.12)] bg-black/95 md:hidden"
          >
            <div className="space-y-1 px-6 py-4 text-sm uppercase tracking-[0.2em] text-slate-200">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-2xl border border-[rgba(212,175,55,0.18)] bg-white/5 px-4 py-4 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
