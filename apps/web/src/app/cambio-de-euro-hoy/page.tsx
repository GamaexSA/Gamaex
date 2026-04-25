import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Euro Hoy", item: "https://www.gamaex.cl/cambio-de-euro-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Euro Hoy en Chile | EUR CLP Actualizado — Gamaex",
  description:
    "Consulta el cambio de euro hoy en Chile. Gamaex en Providencia actualiza el EUR/CLP diariamente. Sin comisiones, precio real, atención directa.",
  keywords: [
    "cambio de euro hoy",
    "cambio euro hoy chile",
    "cuanto esta el euro hoy en chile",
    "precio euro hoy chile",
    "tipo de cambio euro hoy chile",
    "euro hoy chile cotizacion",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-de-euro-hoy",
  },
  openGraph: {
    title: "Cambio de Euro Hoy Chile | Gamaex",
    description: "EUR/CLP actualizado hoy. Cambia euros en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cambio-de-euro-hoy",
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

export default async function CambioDeEuroHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de euro ", h1Accent: "hoy en Chile", heroDesc: "EUR/CLP actualizado hoy en Gamaex. Consulta el precio del euro y cambia tus divisas en Providencia sin comisiones." }} />
    </>
  );
}
