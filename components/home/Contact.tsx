"use client";

import { motion } from "framer-motion";
import { Clock3, Instagram, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";

const contacts = [
  { label: "WhatsApp", value: "+598 98 863 041", href: "https://wa.me/59898863041", icon: MessageCircle },
  { label: "Instagram", value: "@dlsbarber_", href: "https://www.instagram.com/dlsbarber_/", icon: Instagram },
  { label: "Horarios", value: "Lun–Sáb · 10:00 a 20:00", icon: Clock3 },
  { label: "Atención", value: "Con reserva previa", icon: MapPin },
];

export default function Contact() {
  return <section className="home-contact-section" aria-labelledby="contacto-title"><div className="home-container"><div className="home-section-heading"><p>Contacto</p><h2 id="contacto-title">Tu próximo turno empieza acá</h2><span>Escribinos, seguinos y reservá cuando te resulte más cómodo.</span></div><div className="home-contact-grid">{contacts.map((item, index) => { const Icon = item.icon; const content = <><div className="home-contact-icon"><Icon size={20} /></div><p>{item.label}</p><strong>{item.value}</strong>{item.href && <span>Ir al perfil ↗</span>}</>; return <motion.article key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .4, delay: index * .08 }} viewport={{ once: true, amount: .2 }} className="home-contact-card">{item.href ? <Link href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.label}: ${item.value}`}>{content}</Link> : content}</motion.article>; })}</div></div></section>;
}
