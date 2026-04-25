import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Divisas Providencia", item: "https://www.gamaex.cl/cambio-divisas-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Divisas en Providencia | +40 monedas — Gamaex",
  description:
    "Cambio de divisas en Providencia. Gamaex en Av. Pedro de Valdivia 020, a pasos del Metro. Más de 40 monedas, 38 años de experiencia, precios sin comisiones.",
  keywords: [
    "cambio divisas providencia",
    "cambio monedas providencia",
    "divisas providencia santiago",
    "casa de cambio divisas providencia",
    "comprar vender divisas providencia",
    "tipo de cambio providencia",
    "cambio de divisas metro pedro de valdivia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-divisas-providencia",
  },
  openGraph: {
    title: "Cambio de Divisas en Providencia | Gamaex — +40 monedas",
    description: "Cambio de divisas en Providencia. Más de 40 monedas, precios transparentes. Gamaex.",
    url: "https://www.gamaex.cl/cambio-divisas-providencia",
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

export default async function CambioDivisasProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
