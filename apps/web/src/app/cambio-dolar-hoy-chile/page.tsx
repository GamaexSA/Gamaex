import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Dólar Hoy Chile", item: "https://www.gamaex.cl/cambio-dolar-hoy-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Dólar Hoy Chile | USD/CLP actualizado — Gamaex",
  description:
    "Cambio de dólar hoy en Chile. Precio USD/CLP de compra y venta publicado diariamente en Gamaex Providencia. Sin comisiones, 38 años de experiencia.",
  keywords: [
    "cambio dolar hoy chile",
    "dolar hoy chile compra venta",
    "precio cambio dolar chile hoy",
    "USD CLP hoy",
    "cuanto esta el dolar hoy chile",
    "tipo de cambio dolar hoy chile",
    "valor dolar hoy santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-hoy-chile",
  },
  openGraph: {
    title: "Cambio Dólar Hoy Chile | USD/CLP — Gamaex",
    description: "Precio del dólar hoy en Chile, actualizado diariamente. Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-dolar-hoy-chile",
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

export default async function CambioDolarHoyChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
