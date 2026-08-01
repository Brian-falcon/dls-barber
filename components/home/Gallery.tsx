"use client"
import { motion } from "framer-motion";

export default function Gallery() {
  return (
    <section id="galeria" className="py-24 px-6 bg-black text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--gold)]">Galería</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Momentos de estilo</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Descubrí el ambiente, los cortes y la elegancia que define a DLS BARBER.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
              className="overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.2)] bg-slate-900/70 p-6"
            >
              <div className="aspect-[4/3] rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
