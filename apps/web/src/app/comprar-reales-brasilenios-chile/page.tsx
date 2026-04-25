import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Reales Brasileños Chile", item: "https://www.gamaex.cl/comprar-reales-brasilenios-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Reales Brasileños en Chile | BRL CLP — Gamaex",
  description:
    "Compra reales brasileños en Chile al mejor precio. Gamaex en Providencia — cotización BRL/CLP actualizada, sin comisiones. Ideal para viajes a Brasil.",
  keywords: [
    "comprar reales brasileños chile",
    "donde comprar reales santiago",
    "precio real brasileño chile",
    "BRL CLP hoy",
    "comprar BRL santiago",
    "reales brasileños providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-reales-brasilenios-chile",
  },
  openGraph: {
    title: "Comprar Reales Brasileños Chile | Gamaex Providencia",
    description: "BRL/CLP actualizado. Compra reales brasileños en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/comprar-reales-brasilenios-chile",
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

export default async function ComprarRealesBraileniosChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar reales brasileños en ", h1Accent: "Chile", heroDesc: "Compra reales brasileños (BRL) para tu viaje a Brasil. Gamaex en Providencia — cotización BRL/CLP actualizada, sin comisiones." }} />
    </>
  );
}
