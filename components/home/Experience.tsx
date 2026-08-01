import { CalendarCheck2, Clock3, ShieldCheck, Sparkles } from "lucide-react";

const benefits = [
  { icon: CalendarCheck2, title: "Reserva en minutos", text: "Elegí servicio, profesional, fecha y horario desde cualquier dispositivo." },
  { icon: Clock3, title: "Tu agenda, siempre al día", text: "Consultá, cancelá o reprogramá tus propios turnos desde Mi cuenta." },
  { icon: ShieldCheck, title: "Gestión segura", text: "Cada perfil tiene permisos claros para cuidar tu información y tus reservas." },
  { icon: Sparkles, title: "Experiencia premium", text: "Un espacio pensado para que salgas con un look impecable." },
];

export default function Experience() {
  return (
    <section className="home-experience" aria-labelledby="experiencia-title">
      <div className="home-container">
        <div className="home-section-heading home-section-heading-left">
          <p>Todo más simple</p>
          <h2 id="experiencia-title">Tu próximo look empieza antes de llegar</h2>
          <span>Organizá tus visitas sin llamadas, con disponibilidad actualizada y control total de tu agenda.</span>
        </div>
        <div className="home-benefits-grid">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article className="home-benefit" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
