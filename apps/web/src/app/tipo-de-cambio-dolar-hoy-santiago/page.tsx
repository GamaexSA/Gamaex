import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Tipo de Cambio Dólar Hoy Santiago", item: "https://www.gamaex.cl/tipo-de-cambio-dolar-hoy-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Tipo de Cambio Dólar Hoy en Santiago | USD CLP — Gamaex",
  description:
    "Tipo de cambio del dólar hoy en Santiago. Gamaex actualiza el USD/CLP diariamente. Cambia dólares en Providencia sin comisiones — 38 años de experiencia.",
  keywords: [
    "tipo de cambio dolar hoy santiago",
    "USD CLP hoy santiago",
    "cotizacion dolar santiago hoy",
    "precio dolar santiago hoy",
    "tipo cambio dolar santiago",
    "dolar hoy santiago chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/tipo-de-cambio-dolar-hoy-santiago",
  },
  openGraph: {
    title: "Tipo de Cambio Dólar Hoy Santiago | Gamaex",
    description: "USD/CLP actualizado hoy en Santiago. Cambia dólares en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/tipo-de-cambio-dolar-hoy-santiago",
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

export default async function TipoDeCambioDolarHoySantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Tipo de cambio dólar hoy en ", h1Accent: "Santiago", heroDesc: "USD/CLP actualizado hoy en Santiago. Consulta el tipo de cambio del dólar y cambia en Gamaex Providencia sin comisiones." }} />
    </>
  );
}
