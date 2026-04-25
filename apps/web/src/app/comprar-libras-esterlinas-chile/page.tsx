import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Libras Esterlinas Chile", item: "https://www.gamaex.cl/comprar-libras-esterlinas-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Libras Esterlinas en Chile | GBP CLP — Gamaex",
  description:
    "Compra libras esterlinas en Chile al mejor precio. Gamaex en Providencia — cotización GBP/CLP actualizada, sin comisiones, atención directa. 38 años de experiencia.",
  keywords: [
    "comprar libras esterlinas chile",
    "donde comprar libras esterlinas santiago",
    "precio libra esterlina chile",
    "GBP CLP hoy",
    "comprar GBP santiago",
    "libras esterlinas providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-libras-esterlinas-chile",
  },
  openGraph: {
    title: "Comprar Libras Esterlinas Chile | Gamaex Providencia",
    description: "GBP/CLP actualizado. Compra libras esterlinas en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/comprar-libras-esterlinas-chile",
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

export default async function ComprarLibrasEsterlinasChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar libras esterlinas en ", h1Accent: "Chile", heroDesc: "Compra libras esterlinas (GBP) en Gamaex, Providencia. Cotización GBP/CLP actualizada, sin comisiones, atención directa." }} />
    </>
  );
}
