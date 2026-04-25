import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Tipo de Cambio Hoy Chile", item: "https://www.gamaex.cl/tipo-de-cambio-hoy-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Tipo de Cambio Hoy en Chile | Gamaex — Todas las Divisas",
  description:
    "Tipo de cambio hoy en Chile: dólar, euro, real, libra y más de 40 divisas. Gamaex publica los precios de compra y venta diariamente en Providencia. Sin comisiones.",
  keywords: [
    "tipo de cambio hoy chile",
    "tipo de cambio chile hoy todas las divisas",
    "cotizacion divisas hoy chile",
    "tipo cambio dolar euro real hoy",
    "precios divisas hoy santiago",
    "tabla tipo de cambio chile",
    "tipo cambio monedas extranjeras hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/tipo-de-cambio-hoy-chile",
  },
  openGraph: {
    title: "Tipo de Cambio Hoy en Chile | Gamaex — Todas las Divisas",
    description: "Precios actualizados de +40 divisas hoy en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/tipo-de-cambio-hoy-chile",
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

export default async function TipoDeCambioHoyChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
