import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cuánto Vale el Dólar Hoy", item: "https://www.gamaex.cl/cuanto-vale-el-dolar-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cuánto Vale el Dólar Hoy en Chile | Precio USD — Gamaex",
  description:
    "Consulta cuánto vale el dólar hoy en Chile. Gamaex actualiza el precio del dólar diariamente. Cambia tus dólares en Providencia sin comisiones al mejor tipo de cambio.",
  keywords: [
    "cuanto vale el dolar hoy",
    "cuanto vale el dolar hoy chile",
    "precio del dolar hoy chile",
    "valor del dolar hoy en chile",
    "dolar hoy chile precio",
    "tipo de cambio dolar hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cuanto-vale-el-dolar-hoy",
  },
  openGraph: {
    title: "Cuánto Vale el Dólar Hoy en Chile | Gamaex",
    description: "Precio del dólar actualizado hoy en Chile. Cambia USD en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cuanto-vale-el-dolar-hoy",
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

export default async function CuantoValeElDolarHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "¿Cuánto vale el ", h1Accent: "dólar hoy?", heroDesc: "Cotización USD/CLP actualizada diariamente en Gamaex. Consulta el precio del dólar y cambia tus divisas en Providencia sin comisiones." }} />
    </>
  );
}
