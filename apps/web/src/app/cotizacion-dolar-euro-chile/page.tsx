import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cotización Dólar Euro Chile", item: "https://www.gamaex.cl/cotizacion-dolar-euro-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cotización Dólar y Euro en Chile Hoy | USD EUR CLP — Gamaex",
  description:
    "Cotización del dólar y el euro en Chile actualizada hoy. USD/CLP y EUR/CLP en Gamaex Providencia. Cambia sin comisiones, precio real actualizado diariamente.",
  keywords: [
    "cotizacion dolar euro chile",
    "cotizacion dolar y euro hoy",
    "USD EUR CLP hoy",
    "precio dolar euro chile hoy",
    "tipo de cambio dolar euro chile",
    "dolar euro chile hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cotizacion-dolar-euro-chile",
  },
  openGraph: {
    title: "Cotización Dólar y Euro Chile Hoy | Gamaex",
    description: "USD/CLP y EUR/CLP actualizados hoy. Cambia en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cotizacion-dolar-euro-chile",
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

export default async function CotizacionDolarEuroChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cotización dólar y euro en ", h1Accent: "Chile hoy", heroDesc: "USD/CLP y EUR/CLP actualizados diariamente en Gamaex. Consulta el precio del dólar y el euro y cambia en Providencia sin comisiones." }} />
    </>
  );
}
