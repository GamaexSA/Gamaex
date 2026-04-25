import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Euro Chile", item: "https://www.gamaex.cl/cambio-euro-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Euro en Chile | EUR/CLP — Gamaex Providencia",
  description:
    "Cambio de euros en Chile. Compra y venta EUR/CLP en Gamaex Providencia. Precios actualizados, sin comisiones ocultas. 38 años de trayectoria.",
  keywords: [
    "cambio euro chile",
    "euro a peso chileno",
    "EUR CLP hoy",
    "precio euro chile hoy",
    "comprar euro chile",
    "vender euro chile",
    "tipo de cambio euro peso chileno",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-euro-chile",
  },
  openGraph: {
    title: "Cambio Euro Chile | EUR/CLP — Gamaex",
    description: "Precio EUR/CLP actualizado. Compra y venta de euros en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/cambio-euro-chile",
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

export default async function CambioEuroChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
