import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DLS BARBER | Reservas",
    short_name: "DLS BARBER",
    description: "Reservá, gestioná y seguí tus turnos en DLS BARBER.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#060708",
    theme_color: "#060708",
    orientation: "portrait-primary",
    categories: ["lifestyle", "business"],
    icons: [
      { src: "/icon-512.png", sizes: "1254x1254", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "1254x1254", type: "image/png", purpose: "maskable" },
    ],
  };
}
