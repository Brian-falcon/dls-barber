"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck2, CalendarDays, Clock3, MapPin, ShieldCheck } from "lucide-react";
import PwaInstaller from "@/components/pwa/PwaInstaller";

const heroMotion = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <motion.section id="inicio" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } } }} className="home-hero">
      <div className="home-hero-grid" />
      <div className="home-container home-hero-content">
        <div className="home-hero-copy">
          <motion.div variants={heroMotion} className="space-y-6">
            <div className="home-kicker"><span /> Barbería contemporánea</div>
            <h1>Tu estilo,<br /><em>sin esperas.</em></h1>
            <p className="home-hero-description">Reservá tu turno online, elegí a tu barbero y gestioná cada visita desde un solo lugar. Precisión, detalle y una experiencia hecha para vos.</p>
            <div className="home-hero-actions">
              <Link href="/reservas" className="home-primary-button">Reservar mi turno <ArrowRight size={18} /></Link>
              <Link href="/#servicios" className="home-secondary-button">Ver servicios</Link>
            </div>
            <div className="home-hero-meta">
              <span><CalendarDays size={17} /> Reserva online 24/7</span>
              <span><ShieldCheck size={17} /> Datos protegidos</span>
            </div>
            <PwaInstaller />
          </motion.div>
        </div>
        <motion.aside variants={heroMotion} className="home-hero-card">
          <div className="home-card-topline"><span>AGENDA DIGITAL</span><i aria-label="Agenda disponible" /></div>
          <div className="home-appointment-preview">
            <div className="home-cut-mark"><Image src="/images/brand/dls-logo.png" alt="Logo DLS BARBER" fill sizes="110px" className="home-brand-mark" /></div>
            <div><span className="home-preview-label">PRÓXIMO TURNO</span><strong>Elegí tu horario</strong><p>Confirmación inmediata.</p></div>
          </div>
          <div className="home-card-time"><CalendarCheck2 size={18} /><div><span>Disponibilidad semanal</span><strong>Lunes a sábado</strong></div></div>
          <div className="home-card-details">
            <span><Clock3 size={16} /> 08:00–12:30 · 14:30–19:30</span>
            <span><MapPin size={16} /> Atención con reserva</span>
          </div>
        </motion.aside>
      </div>
      <div className="home-hero-stats">
        <div><strong>100%</strong><span>Online</span></div>
        <div><strong>24/7</strong><span>Reservas</span></div>
        <div><strong>1 min</strong><span>Para agendar</span></div>
      </div>
    </motion.section>
  );
}
