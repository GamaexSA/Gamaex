import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Gamaex Providencia", item: "https://www.gamaex.cl/gamaex-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Gamaex Providencia | Casa de Cambio Av. Pedro de Valdivia 020",
  description:
    "Gamaex en Providencia, Santiago. Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia. Casa de cambio con más de 38 años de trayectoria, sin comisiones.",
  keywords: [
    "gamaex providencia",
    "gamaex chile providencia",
    "gamaex casa de cambio providencia",
    "gamaex pedro de valdivia",
    "gamaex santiago",
    "gamaex divisas providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/gamaex-providencia",
  },
  openGraph: {
    title: "Gamaex Providencia | Casa de Cambio",
    description: "Gamaex en Av. Pedro de Valdivia 020, Providencia. Sin comisiones, 38 años.",
    url: "https://www.gamaex.cl/gamaex-providencia",
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

export default async function GamaexProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Gamaex — Casa de cambio en ", h1Accent: "Providencia", heroDesc: "Gamaex en Av. Pedro de Valdivia 020, Providencia — a pasos del Metro Pedro de Valdivia. Más de 38 años cambiando divisas sin comisiones." }} />
    </>
  );
}
