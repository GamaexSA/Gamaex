import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Tipo de Cambio de Hoy", item: "https://www.gamaex.cl/tipo-de-cambio-de-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Tipo de Cambio de Hoy en Chile | USD EUR CLP — Gamaex",
  description:
    "Tipo de cambio de hoy en Chile. USD/CLP, EUR/CLP y +40 divisas actualizadas en Gamaex Providencia. Sin comisiones, precio real diario.",
  keywords: [
    "tipo de cambio de hoy",
    "tipo de cambio hoy chile",
    "dolar hoy tipo de cambio",
    "euro hoy tipo de cambio chile",
    "tipo cambio divisas hoy",
    "tipo de cambio actual chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/tipo-de-cambio-de-hoy",
  },
  openGraph: {
    title: "Tipo de Cambio de Hoy Chile | Gamaex",
    description: "USD/CLP y EUR/CLP actualizados hoy. Cambia divisas en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/tipo-de-cambio-de-hoy",
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

export default async function TipoDeCambioDeHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Tipo de cambio ", h1Accent: "de hoy en Chile", heroDesc: "USD/CLP, EUR/CLP y +40 divisas actualizadas hoy en Gamaex Providencia. Consulta y cambia sin comisiones, precios reales." }} />
    </>
  );
}
