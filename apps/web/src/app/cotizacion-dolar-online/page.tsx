import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cotización Dólar Online", item: "https://www.gamaex.cl/cotizacion-dolar-online" },
  ],
});

export const metadata: Metadata = {
  title: "Cotización Dólar Online en Chile | Gamaex — Precio en Tiempo Real",
  description:
    "Cotiza el dólar online con Gamaex. Precio compra y venta USD/CLP actualizado. Calculadora de divisas para saber cuánto recibirás antes de venir al local en Providencia.",
  keywords: [
    "cotizacion dolar online",
    "cotizar dolar chile online",
    "cotizacion dolar en tiempo real chile",
    "calculadora dolar CLP",
    "cotizacion USD CLP online",
    "cotizar divisas online chile",
    "precio compra venta dolar hoy",
    "consultar precio dolar santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cotizacion-dolar-online",
  },
  openGraph: {
    title: "Cotización Dólar Online | Gamaex Chile — USD/CLP en Tiempo Real",
    description:
      "Precio compra/venta USD/CLP actualizado. Calculadora de divisas. Gamaex Providencia.",
    url: "https://www.gamaex.cl/cotizacion-dolar-online",
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

export default async function CotizacionDolarOnlinePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cotización dólar ", h1Accent: "online", heroDesc: "Consulta la cotización del dólar online en Gamaex. Precio USD/CLP actualizado diariamente — cambia en Providencia sin comisiones." }} />
    </>
  );
}
