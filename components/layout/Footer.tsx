import Link from "next/link";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/dlsbarber" },
  { label: "WhatsApp", href: "https://wa.me/5491112345678" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(212,175,55,0.12)] bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4">
            <p className="text-lg font-black uppercase tracking-[0.35em] text-[var(--gold)]">DLS BARBER</p>
            <p className="max-w-md text-slate-400">
              Barbería de lujo con experiencia premium, estilo exclusivo y atención de primer nivel.
            </p>
          </div>

          <div className="grid gap-4">
            <h3 className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">Contacto</h3>
            <p className="text-slate-300">WhatsApp: +54 9 11 1234 5678</p>
            <p className="text-slate-300">Horarios: Lun-Sáb 10:00 - 20:00</p>
            <p className="text-slate-300">Dirección: Av. Principal 123, Buenos Aires</p>
          </div>

          <div className="grid gap-4">
            <h3 className="text-sm uppercase tracking-[0.3em] text-[var(--gold)]">Redes sociales</h3>
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 transition hover:text-[var(--gold)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[rgba(212,175,55,0.1)] pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} DLS BARBER. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
