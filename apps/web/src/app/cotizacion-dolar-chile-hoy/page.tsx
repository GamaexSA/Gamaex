import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cotización Dólar Chile Hoy", item: "https://www.gamaex.cl/cotizacion-dolar-chile-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cotización Dólar Chile Hoy | USD/CLP — Gamaex Providencia",
  description:
    "Cotización del dólar en Chile hoy. Precio USD/CLP de compra y venta actualizado diariamente en Gamaex Providencia. Calcula en nuestra calculadora.",
  keywords: [
    "cotizacion dolar chile hoy",
    "cotizacion USD CLP hoy",
    "precio dolar chile hoy compra",
    "cotizacion dolar santiago hoy",
    "dolar chileno cotizacion hoy",
    "cotizacion dolar peso chileno",
    "cuanto esta el dolar hoy chile compra venta",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cotizacion-dolar-chile-hoy",
  },
  openGraph: {
    title: "Cotización Dólar Chile Hoy | USD/CLP — Gamaex",
    description: "Cotización USD/CLP actualizada hoy. Gamaex Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/cotizacion-dolar-chile-hoy",
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

export default async function CotizacionDolarChileHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cotización dólar ", h1Accent: "Chile hoy", heroDesc: "Cotización del dólar en Chile actualizada hoy. Consulta el USD/CLP y cambia tus divisas en Gamaex Providencia sin comisiones." }} />
    </>
  );
}
