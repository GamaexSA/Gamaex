import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Divisas Santiago Centro", item: "https://www.gamaex.cl/cambio-divisas-santiago-centro" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Divisas Santiago Centro | Gamaex Providencia",
  description:
    "Cambia divisas en Santiago. Gamaex en Av. Pedro de Valdivia 020, Providencia — referencia para todo Santiago. Más de 40 monedas, sin comisiones, 38 años de experiencia.",
  keywords: [
    "cambio divisas santiago centro",
    "casa de cambio santiago",
    "comprar dolares santiago centro",
    "donde cambiar moneda santiago",
    "divisas santiago chile",
    "cambio moneda extranjera santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-divisas-santiago-centro",
  },
  openGraph: {
    title: "Cambio Divisas Santiago | Gamaex Providencia",
    description: "Cambio de divisas en Santiago. Gamaex en Providencia, más de 40 monedas, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-divisas-santiago-centro",
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

export default async function CambioDivisasSantiagoCentroPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de divisas en ", h1Accent: "Santiago", heroDesc: "Cambio de divisas en Santiago con más de 40 monedas. Gamaex en Providencia — la referencia de casas de cambio en la ciudad." }} />
    </>
  );
}
