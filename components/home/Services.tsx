"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Scissors, Sparkles, UserRoundCheck, WandSparkles } from "lucide-react";

const services = [
  { title: "Corte clásico", description: "Proporción, textura y una terminación limpia que se mantiene bien todos los días.", icon: Scissors, detail: "Esencial" },
  { title: "Corte premium", description: "Asesoramiento personal, fade al detalle y un look construido para vos.", icon: Sparkles, detail: "Personalizado" },
  { title: "Barba", description: "Perfilado, líneas precisas y cuidado para una barba con presencia.", icon: UserRoundCheck, detail: "Perfilado" },
  { title: "Corte + barba", description: "La sesión completa para salir renovado, prolijo y con identidad propia.", icon: WandSparkles, detail: "Experiencia completa" },
];

export default function Services() {
  return (
    <section id="servicios" className="home-services-section">
      <div className="home-container">
        <div className="home-services-heading">
          <div>
            <p className="eyebrow">La carta DLS</p>
            <h2>Servicios precisos.<br /><span>Resultados personales.</span></h2>
          </div>
          <p>Cada visita tiene su propio ritmo. Elegí el servicio y reservá con el profesional que mejor se adapta a tu estilo.</p>
        </div>
        <div className="home-services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return <motion.article key={service.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true, amount: 0.2 }} className="home-service-card">
              <div className="home-service-top"><Icon aria-hidden="true" /><span>0{index + 1}</span></div>
              <p className="home-service-label">{service.detail}</p>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="home-service-arrow"><ArrowUpRight size={19} /></span>
            </motion.article>;
          })}
        </div>
      </div>
    </section>
  );
}
