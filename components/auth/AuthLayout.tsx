import Image from "next/image";
import Link from "next/link";
import { CalendarCheck2, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthLayout({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children: ReactNode }) {
  return <main className="auth-page"><div className="auth-page-glow" /><div className="auth-wrap"><section className="auth-brand-panel"><Link href="/" className="auth-brand"><Image src="/images/brand/dls-logo.png" alt="DLS BARBER" width={48} height={48} priority /><span>DLS BARBER</span></Link><div className="auth-brand-copy"><p className="eyebrow">Experiencia DLS</p><h1>Tu estilo.<br /><em>Tu momento.</em></h1><p>Gestioná tus reservas, elegí tu profesional y mantené cada visita organizada desde un solo lugar.</p></div><div className="auth-benefits"><span><CalendarCheck2 size={17} /> Reservas simples</span><span><ShieldCheck size={17} /> Acceso seguro</span><span><Sparkles size={17} /> Atención personalizada</span></div></section><section className="auth-form-panel"><div className="auth-form-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div>{children}</section></div></main>;
}
