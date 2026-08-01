"use client"
import Link from "next/link";
import { motion } from "framer-motion";

const heroMotion = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <motion.section
      id="inicio"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
      }}
      className="relative overflow-hidden bg-black text-white pt-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(212,175,55,0.12),_transparent_25%)]" />
      <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 flex min-h-[calc(100vh-7rem)] items-center justify-center px-6 py-24">
        <div className="w-full max-w-5xl rounded-[2rem] border border-[rgba(212,175,55,0.32)] bg-black/80 p-10 shadow-[0_0_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <motion.div variants={heroMotion} className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--gold)] bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.3em] text-[var(--gold)]">
              Lujo · Estilo · Precisión
            </div>
            <h1 className="text-5xl font-black uppercase tracking-[0.15em] text-white md:text-6xl">
              DLS BARBER
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-300 md:mx-0 md:text-xl">
              La barbería premium en la ciudad, cortes exclusivos y experiencia VIP para clientes exigentes.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-4 pt-6 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/reservas"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--gold)] px-7 py-4 text-sm font-semibold uppercase text-black transition hover:bg-white/90 sm:w-auto"
              >
                Reservar turno
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[var(--gold)] bg-black/80 px-7 py-4 text-sm font-semibold uppercase text-[var(--gold)] transition hover:bg-[rgba(212,175,55,0.12)] sm:w-auto"
              >
                Iniciar sesión
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
