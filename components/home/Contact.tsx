"use client"
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

const contacts = [
  { label: "WhatsApp", value: "+54 9 11 1234 5678" },
  { label: "Instagram", value: "@dlsbarber" },
  { label: "Horarios", value: "Lun-Sáb 10:00 - 20:00" },
  { label: "Dirección", value: "Av. Principal 123, Buenos Aires" },
];

export default function Contact() {
  return (
    <section className="py-24 px-6 bg-[#060606] text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--gold)]">Contacto</p>
          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Hablemos de tu próximo turno</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Reservá con facilidad y mantenete conectado con nuestras redes y horarios de atención.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {contacts.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card>
                <p className="text-sm uppercase tracking-[0.25em] text-[var(--gold)]">{item.label}</p>
                <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
