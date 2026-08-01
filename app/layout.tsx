import type { Metadata } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const deploymentUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const metadataBase = new URL(configuredSiteUrl || deploymentUrl || "http://localhost:3000");

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase,
  title: "DLS BARBER",
  description: "Barbería premium - Reservá tu turno online",
  applicationName: "DLS BARBER",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon-512.png", apple: "/icon-512.png" },
  keywords: ["barbería", "cortes", "reservas", "barbero", "DLS"],
  authors: [{ name: "DLS BARBER" }],
  openGraph: {
    title: "DLS BARBER",
    description: "Barbería premium - Reservá tu turno online",
    url: "/",
    siteName: "DLS BARBER",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#060708",
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
