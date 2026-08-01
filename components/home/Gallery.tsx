import Image from "next/image";

const work = [
  { src: "/images/work/corte-editorial.png", title: "Corte editorial", text: "Textura, movimiento y terminación precisa.", wide: true },
  { src: "/images/work/barba-premium.png", title: "Barba premium", text: "Diseño definido para una presencia impecable." },
  { src: "/images/work/fade-proceso.png", title: "Fade al detalle", text: "Técnica, transición y personalidad.", wide: true },
];

export default function Gallery() {
  return <section id="galeria" className="home-work-section" aria-labelledby="trabajos-title"><div className="home-container"><div className="home-section-heading home-section-heading-left"><p>Trabajos reales</p><h2 id="trabajos-title">Detalle que se nota</h2><span>Cortes, fades y perfilados construidos para acompañar tu identidad.</span></div><div className="home-work-grid">{work.map((item) => <article key={item.title} className={`home-work-card ${item.wide ? "home-work-card-wide" : ""}`}><Image src={item.src} alt={`${item.title} realizado en DLS BARBER`} fill sizes="(max-width: 700px) 100vw, 50vw" className="home-work-image" /><div className="home-work-overlay"><p>{item.title}</p><span>{item.text}</span></div></article>)}</div></div></section>;
}
