import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Dólar Euro Santiago", item: "https://www.gamaex.cl/cambio-dolar-euro-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Dólar y Euro en Santiago | USD EUR CLP — Gamaex",
  description:
    "Cambia dólares y euros en Gamaex, Providencia. Precio USD/CLP y EUR/CLP actualizado diariamente. Sin comisiones, atención directa. 38 años de experiencia en Santiago.",
  keywords: [
    "cambio dolar euro santiago",
    "comprar dolar y euro santiago",
    "USD EUR CLP santiago",
    "precio dolar euro chile hoy",
    "casa de cambio dolar euro providencia",
    "cambio divisas dolar euro santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-euro-santiago",
  },
  openGraph: {
    title: "Cambio Dólar y Euro Santiago | Gamaex Providencia",
    description: "USD/CLP y EUR/CLP actualizados en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/cambio-dolar-euro-santiago",
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

export default async function CambioDolarEuroSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio dólar y euro en ", h1Accent: "Santiago", heroDesc: "USD/CLP y EUR/CLP actualizados en Gamaex, Providencia. Compra y venta de dólares y euros en Santiago sin comisiones." }} />
    </>
  );
}
