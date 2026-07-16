import type { Metadata } from "next";
import NosotrosPage from "@/components/nosotros-page";

export const metadata: Metadata = {
  title: "Nosotros · Casa de Cambio en Providencia",
  description:
    "Gamaex es una casa de cambio chilena familiar en Providencia, Santiago. Más de tres décadas de trayectoria, registrados en UAF y socios de Western Union.",
  alternates: { canonical: "https://www.gamaex.cl/nosotros" },
  openGraph: {
    title: "Nosotros | Gamaex Chile — Casa de Cambio en Providencia",
    description:
      "Casa de cambio familiar con más de tres décadas de trayectoria en el mercado cambiario chileno. Registrados en UAF, socios de Western Union.",
    url: "https://www.gamaex.cl/nosotros",
  },
};

export default function Page() {
  return <NosotrosPage />;
}
