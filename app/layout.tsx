import type { Metadata } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DLS BARBER",
  description: "Barbería premium - Reservá tu turno online",
  applicationName: "DLS BARBER",
  keywords: ["barbería", "cortes", "reservas", "barbero", "DLS"],
  authors: [{ name: "DLS BARBER" }],
  openGraph: {
    title: "DLS BARBER",
    description: "Barbería premium - Reservá tu turno online",
    url: "https://your-domain.example/",
    siteName: "DLS BARBER",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.className} ${bebas.className}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}