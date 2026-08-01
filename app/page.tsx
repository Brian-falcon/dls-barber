import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Barbers from "@/components/home/Barbers";
import Gallery from "@/components/home/Gallery";
import Contact from "@/components/home/Contact";
import Experience from "@/components/home/Experience";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const barbers = await prisma.barber.findMany({ where: { activo: true }, select: { id: true, nombre: true, descripcion: true }, orderBy: { nombre: "asc" } });
  return (
    <main>
      <Hero />
      <Experience />
      <Services />
      <Barbers barbers={barbers} />
      <Gallery />
      <Contact />
    </main>
  );
}
