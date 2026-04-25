import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Tipo de Cambio Dólar Hoy Chile", item: "https://www.gamaex.cl/tipo-de-cambio-dolar-hoy-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Tipo de Cambio Dólar Hoy Chile | USD/CLP — Gamaex",
  description:
    "Tipo de cambio del dólar hoy en Chile. Precio USD/CLP de compra y venta publicado diariamente en Gamaex Providencia. Sin comisiones, 38 años de experiencia.",
  keywords: [
    "tipo de cambio dolar hoy chile",
    "tipo cambio USD CLP hoy",
    "precio dolar hoy chile banco",
    "tipo de cambio dolar peso chileno hoy",
    "dolar hoy chile compra venta",
    "cotizacion dolar hoy chile",
    "cuanto esta el dolar hoy en chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/tipo-de-cambio-dolar-hoy-chile",
  },
  openGraph: {
    title: "Tipo de Cambio Dólar Hoy Chile | USD/CLP — Gamaex",
    description: "Tipo de cambio USD/CLP hoy en Chile. Gamaex Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/tipo-de-cambio-dolar-hoy-chile",
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

export default async function TipoDeCambioDolarHoyChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Tipo de cambio dólar ", h1Accent: "hoy en Chile", heroDesc: "Tipo de cambio del dólar actualizado hoy en Chile. Cotización USD/CLP en Gamaex Providencia — sin comisiones." }} />
    </>
  );
}
