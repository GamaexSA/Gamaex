import type { Metadata } from "next";
import ServiciosPage from "@/components/servicios-page";

export const metadata: Metadata = {
  title: "Servicios · Divisas, Transferencias y Pago de Tarjetas | Gamaex",
  description:
    "Servicios de Gamaex en Providencia: cambio de +40 divisas, transferencias internacionales, pago de tarjetas de crédito y atención a empresas. Sin comisiones, 38 años de trayectoria.",
  alternates: { canonical: "https://www.gamaex.cl/servicios" },
  openGraph: {
    title: "Servicios | Gamaex Chile",
    description:
      "Cambio de 40+ divisas, transferencias internacionales, pago de tarjetas de crédito y atención corporativa. Sin comisiones, atención presencial en Providencia.",
    url: "https://www.gamaex.cl/servicios",
  },
};

export default function Page() {
  return <ServiciosPage />;
}
