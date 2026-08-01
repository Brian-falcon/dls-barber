"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Scissors } from "lucide-react";

type Barber = { id: string; nombre: string; descripcion: string | null };
const portraits = ["/images/team/barber-1.png", "/images/team/barber-2.png", "/images/team/barber-3.png"];

export default function Barbers({ barbers }: { barbers: Barber[] }) {
  return <section id="barberos" className="home-team-section" aria-labelledby="barberos-title"><div className="home-container"><div className="home-section-heading"><p>Nuestro equipo</p><h2 id="barberos-title">Profesionales que hacen la diferencia</h2><span>Conocé al equipo disponible y elegí con quién querés reservar tu próxima visita.</span></div>{barbers.length ? <div className="home-team-grid">{barbers.map((barber, index) => <motion.article key={barber.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} viewport={{ once: true, amount: 0.2 }} className="home-team-card"><Image src={portraits[index % portraits.length]} alt={`Retrato del profesional ${barber.nombre}`} fill sizes="(max-width: 900px) 50vw, 33vw" className="home-team-photo" /><div className="home-team-content"><div className="home-team-card-top"><span><BadgeCheck size={15} /> Disponible</span><Scissors size={18} /></div><h3>{barber.nombre}</h3><p>{barber.descripcion?.trim() || "Profesional de DLS BARBER, listo para tu próxima reserva."}</p></div></motion.article>)}</div> : <p className="home-empty-state">Pronto vas a conocer a nuestro equipo.</p>}</div></section>;
}
