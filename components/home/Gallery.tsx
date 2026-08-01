"use client";

import { motion } from "framer-motion";

const moments = [
  ["PRECISIÓN", "Degradados y terminaciones al detalle"], ["RITUAL", "Un momento para renovar tu imagen"], ["ACTITUD", "Estilo que habla por vos"],
  ["BARBA", "Perfilado con carácter"], ["CLÁSICO", "Técnica que nunca falla"], ["DLS", "Tu próxima versión"],
];

export default function Gallery() {
  return (
    <section id="galeria" className="py-24 px-6 bg-black text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center"><p className="text-sm uppercase tracking-[0.35em] text-[var(--gold)]">Galería</p><h2 className="mt-4 text-4xl font-semibold md:text-5xl">Momentos de estilo</h2><p className="mx-auto mt-4 max-w-2xl text-slate-400">Descubrí el ambiente, los cortes y la elegancia que define a DLS BARBER.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {moments.map(([label, caption], index) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: index * 0.08 }} viewport={{ once: true, amount: 0.2 }} className="home-gallery-card">
              <div className="home-gallery-shape" data-index={index}><span>{label}</span></div><p>{caption}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
