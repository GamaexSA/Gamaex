import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Euros a Pesos Chilenos", item: "https://www.gamaex.cl/cambiar-euros-a-pesos-chilenos" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Euros a Pesos Chilenos · EUR/CLP",
  description:
    "Cambia euros a pesos chilenos en Gamaex, Providencia. Cotización EUR/CLP actualizada, sin comisiones, pago inmediato. 38 años de experiencia.",
  keywords: [
    "cambiar euros a pesos chilenos",
    "euro a peso chileno",
    "EUR CLP hoy",
    "cuanto vale el euro en pesos chilenos",
    "cambio euro peso chile",
    "convertir euros a pesos chilenos",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-euros-a-pesos-chilenos",
  },
  openGraph: {
    title: "Cambiar Euros a Pesos Chilenos | Gamaex",
    description: "EUR/CLP actualizado. Cambia euros a pesos en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cambiar-euros-a-pesos-chilenos",
  },
};

async function getRates(): Promise<PublicRatesResponse> {
  const empty: PublicRatesResponse = { rates: [], system_status: "stale", last_sync_at: "", cache_ttl_seconds: 60 };
  try {
    const url = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/rates/public`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return res.json() as Promise<PublicRatesResponse>;
  } catch { return empty; }
}

export default async function CambiarEurosAPesosChilenosPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar euros a ", h1Accent: "pesos chilenos", heroDesc: "Cotización EUR/CLP actualizada diariamente. Cambia tus euros en Gamaex, Providencia — sin comisiones, pago inmediato, atención directa.", articleHeading: "¿Cómo cambiar euros a pesos chilenos sin comisiones?", articleText: "El euro es la moneda oficial de gran parte de Europa y una de las que más llega a Chile con quienes vuelven de un viaje por España, Francia o Italia, o reciben pagos desde el extranjero. Al pasar euros a pesos chilenos, lo que define cuántos pesos recibes es el tipo de cambio del día, no una tarifa aparte. En Gamaex trabajamos con el precio publicado de la jornada, sin comisiones ni cargos ocultos, así que el monto que ves es el que se te entrega.\n\nPara calcular antes de venir, usa la calculadora de esta página: ingresas los euros y te muestra el equivalente en pesos con la tasa vigente, que actualizamos a diario. La tabla de valores se ve en vivo, así comparas con calma. Si traes un monto importante o billetes de denominación alta, escríbenos por WhatsApp para confirmar la disponibilidad antes de acercarte.\n\nEstamos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1. Operamos desde 1988 como casa de cambio familiar, con atención presencial y sin reserva previa. Para montos altos pedimos tu cédula de identidad y registramos la operación, según la normativa de la UAF. No somos banco: no necesitas abrir cuenta y todo se resuelve al instante, en efectivo y cara a cara." }} />
    </>
  );
}
