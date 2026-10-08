import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cotización Euro Online", item: "https://www.gamaex.cl/cotizacion-euro-online" },
  ],
});

export const metadata: Metadata = {
  title: "Cotización Euro Online Chile · EUR/CLP",
  description:
    "Cotización del euro online en Chile. Precio EUR/CLP actualizado en Gamaex. Calcula cuántos pesos chilenos recibes por tus euros. Atención en Providencia.",
  keywords: [
    "cotizacion euro online chile",
    "cotizacion euro hoy chile",
    "precio euro online chile",
    "EUR CLP cotizacion",
    "calculadora euro peso chileno",
    "cuanto vale un euro en chile",
    "tipo de cambio euro online chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cotizacion-euro-online",
  },
  openGraph: {
    title: "Cotización Euro Online Chile | EUR/CLP — Gamaex",
    description: "Precio EUR/CLP online actualizado. Calculadora euro/peso chileno en Gamaex.",
    url: "https://www.gamaex.cl/cotizacion-euro-online",
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

export default async function CotizacionEuroOnlinePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cotización euro ", h1Accent: "online", heroDesc: "Consulta la cotización del euro online en Gamaex. Precio EUR/CLP actualizado diariamente — cambia en Providencia sin comisiones.", articleHeading: "¿Cómo ver la cotización del euro online antes de venir?", articleText: "Consultar la cotización del euro por internet te permite planificar tu cambio sin salir de casa. Como el valor del euro frente al peso se mueve a diario según los mercados, ver la referencia online justo antes de operar evita sorpresas y te da una idea clara de cuántos pesos recibirás o cuántos necesitarás para comprar. Es el primer paso natural antes de acercarte a una casa de cambio física.\n\nEn esta página de Gamaex tienes la tabla de tasas en vivo y una calculadora: ingresas el monto en euros y te muestra el equivalente en pesos con la tasa vigente, que actualizamos a diario. Todo con el precio del día, sin comisiones ni cargos ocultos, para que lo que ves online sea lo mismo que trabajamos en el mostrador. Si tras revisarlo quieres cambiar un monto alto, escríbenos por WhatsApp para confirmar disponibilidad de billetes.\n\nLa consulta es online, pero la operación se concreta en persona, en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1. Atendemos desde 1988, sin reserva previa. Para montos altos pedimos tu cédula de identidad y registramos la operación según la normativa de la UAF. No somos banco: revisas online, llegas con las cuentas claras y cambias tus euros en efectivo al instante." }} />
    </>
  );
}
