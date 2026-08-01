import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Barbers from "@/components/home/Barbers";
import Gallery from "@/components/home/Gallery";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Barbers />
      <Gallery />
      <Contact />
    </main>
  );
}