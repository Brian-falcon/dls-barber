import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { label: "Instagram @dlsbarber_", href: "https://www.instagram.com/dlsbarber_/" },
  { label: "WhatsApp +598 98 863 041", href: "https://wa.me/59898863041" },
];

export default function Footer() {
  return <footer className="border-t border-[rgba(212,175,55,0.12)] bg-black text-white"><div className="mx-auto max-w-7xl px-6 py-16"><div className="grid gap-10 lg:grid-cols-3"><div className="space-y-4"><div className="flex items-center gap-3"><Image src="/images/brand/dls-logo.png" alt="DLS BARBER" width={48} height={48} className="rounded-full" /><p className="text-lg font-black uppercase tracking-[0.35em] text-[var(--gold)]">DLS BARBER</p></div><p className="max-w-md text-slate-400">Estilo personal, técnica y una experiencia de reserva simple de principio a fin.</p></div><div className="grid gap-4"><h3 className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">Contacto</h3><Link href="https://wa.me/59898863041" target="_blank" rel="noreferrer" className="text-slate-300 transition hover:text-[var(--gold)]">WhatsApp: +598 98 863 041</Link><p className="text-slate-300">Horarios: Lun–Sáb · 10:00 a 20:00</p><p className="text-slate-300">Atención con reserva previa</p></div><div className="grid gap-4"><h3 className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">Seguinos</h3>{socialLinks.map((link) => <Link key={link.label} href={link.href} target="_blank" rel="noreferrer" className="text-slate-300 transition hover:text-[var(--gold)]">{link.label}</Link>)}</div></div><div className="mt-12 border-t border-[rgba(212,175,55,0.1)] pt-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} DLS BARBER. Todos los derechos reservados.</div></div></footer>;
}
