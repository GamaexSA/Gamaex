import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Divisas Online Chile", item: "https://www.gamaex.cl/cambio-divisas-online-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Divisas Online Chile · Tiempo Real",
  description:
    "Consulta cotizaciones de divisas online en Chile. Gamaex publica precios en tiempo real. Cotiza por WhatsApp y opera en Providencia sin comisiones.",
  keywords: [
    "cambio divisas online chile",
    "cotizacion divisas online chile",
    "tipo de cambio online chile",
    "precio divisas online santiago",
    "cambio moneda online chile",
    "cotizacion dolar online chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-divisas-online-chile",
  },
  openGraph: {
    title: "Cambio Divisas Online Chile | Gamaex",
    description: "Cotizaciones de divisas online en Gamaex Chile. Consulta precios y opera sin comisiones.",
    url: "https://www.gamaex.cl/cambio-divisas-online-chile",
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

export default async function CambioDivisasOnlineChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cotización de divisas ", h1Accent: "online en Chile", heroDesc: "Precios de divisas en tiempo real en Gamaex Chile. Consulta el tipo de cambio, cotiza por WhatsApp y opera en Providencia sin comisiones.", articleHeading: "¿Puedo ver la cotización de divisas online y en tiempo real?", articleText: "Sí: la cotización de divisas la puedes ver online y en tiempo real en esta misma página. La tabla de tasas y la calculadora muestran el precio del día de más de 40 monedas, para que consultes desde tu teléfono o computador cuántos pesos chilenos equivalen a tu divisa. Es importante aclarar que la cotización es online, pero la operación de cambio se realiza de forma presencial en nuestro local de Providencia, sin comisiones.\n\nLa cotización en tiempo real es útil porque el tipo de cambio se mueve a diario e incluso dentro de la jornada, según el mercado internacional, el precio del cobre, las tasas de interés y el contexto económico global y local. Por eso la página se actualiza con el precio del día en lugar de mostrar cifras fijas. Consúltala en línea antes de salir para llegar con una referencia clara de tu cambio.\n\nLuego de revisar la cotización online, acércate a cambiar en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia (Línea 1). Gamaex es una casa de cambio familiar que atiende de forma presencial desde 1988, con más de 40 divisas. Para montos altos se solicita la cédula de identidad según la normativa UAF, y puedes escribirnos por WhatsApp para confirmar la disponibilidad de billetes. No cambiamos por internet: la cotización es online, el cambio es en el local." }} />
    </>
  );
}
