import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Dólar Hoy", item: "https://www.gamaex.cl/cambio-de-dolar-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Dólar Hoy en Chile | USD CLP Actualizado — Gamaex",
  description:
    "Consulta el cambio de dólar hoy en Chile. Gamaex en Providencia actualiza el USD/CLP diariamente. Sin comisiones, precio real, atención directa.",
  keywords: [
    "cambio de dolar hoy",
    "cambio dolar hoy chile",
    "cuanto esta el dolar hoy",
    "precio dolar hoy chile",
    "tipo de cambio dolar hoy",
    "dolar hoy chile cotizacion",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-de-dolar-hoy",
  },
  openGraph: {
    title: "Cambio de Dólar Hoy Chile | Gamaex",
    description: "USD/CLP actualizado hoy. Cambia dólares en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cambio-de-dolar-hoy",
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

export default async function CambioDeDolarHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de dólar ", h1Accent: "hoy en Chile", heroDesc: "USD/CLP actualizado hoy en Gamaex. Consulta el precio del dólar y cambia tus divisas en Providencia sin comisiones, sin sorpresas." }} />
    </>
  );
}
