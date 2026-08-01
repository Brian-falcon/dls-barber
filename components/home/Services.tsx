"use client"
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

const services = [
  {
    title: "Corte clásico",
    description: "Estilo impecable con definición y acabado tradicional.",
  },
  {
    title: "Corte premium",
    description: "Diseños modernos, degradados perfectos y cuidado personalizado.",
  },
  {
    title: "Barba",
    description: "Perfilado y arreglo de barba con productos de alta calidad.",
  },
  {
    title: "Corte + barba",
    description: "Experiencia completa con corte y arreglo de barba de lujo.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 px-6 bg-black text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">Nuestro servicio</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Experiencias de barbería premium</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Cada servicio está diseñado para entregar estilo, confort y un acabado profesional en cada visita.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">Servicio</span>
                  <div className="h-10 w-10 rounded-full border border-[var(--gold)]" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-slate-300">{service.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
