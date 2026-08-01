"use client"
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

const barbers = [
  { name: "Marco", role: "Maestro del corte clásico" },
  { name: "Luis", role: "Especialista en fades y diseño" },
  { name: "Sofía", role: "Experta en barba y detalles premium" },
];

export default function Barbers() {
  return (
    <section id="barberos" className="py-24 px-6 bg-[#070707] text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--gold)]">Nuestros expertos</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Barberos de confianza</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {barbers.map((barber, index) => (
            <motion.div
              key={barber.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Card>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="h-20 w-20 rounded-full bg-slate-800 border border-[var(--gold)]" />
                  <div className="text-right text-sm uppercase tracking-[0.25em] text-[var(--gold)]">
                    Staff
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{barber.name}</h3>
                <p className="text-slate-300">{barber.role}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
