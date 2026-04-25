import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Sol Peruano Chile", item: "https://www.gamaex.cl/cambio-sol-peruano-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Sol Peruano en Chile | PEN CLP — Gamaex",
  description:
    "Cambia soles peruanos en Chile. Gamaex en Providencia compra y vende PEN al mejor precio. Sin comisiones, atención directa. 38 años de experiencia en cambio de divisas.",
  keywords: [
    "cambio sol peruano chile",
    "PEN CLP hoy",
    "precio sol peruano chile",
    "comprar soles peruanos santiago",
    "cambiar sol peruano a peso chileno",
    "divisas peruanas chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-sol-peruano-chile",
  },
  openGraph: {
    title: "Cambio Sol Peruano Chile | Gamaex Providencia",
    description: "PEN/CLP actualizado. Compra y venta de soles peruanos en Gamaex sin comisiones.",
    url: "https://www.gamaex.cl/cambio-sol-peruano-chile",
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

export default async function CambioSolPeruanoChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio sol ", h1Accent: "peruano en Chile", heroDesc: "Compra y venta de soles peruanos (PEN) en Gamaex, Providencia. Cotización PEN/CLP actualizada, sin comisiones." }} />
    </>
  );
}
