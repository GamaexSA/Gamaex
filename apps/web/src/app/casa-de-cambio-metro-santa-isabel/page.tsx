import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Metro Santa Isabel", item: "https://www.gamaex.cl/casa-de-cambio-metro-santa-isabel" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Metro Santa Isabel | Gamaex Providencia",
  description:
    "Casa de cambio cerca de Metro Santa Isabel. Gamaex en Av. Pedro de Valdivia 020, Providencia — a pocas paradas de Santa Isabel. Sin comisiones, 38 años de experiencia.",
  keywords: [
    "casa de cambio metro santa isabel",
    "cambio divisas santa isabel providencia",
    "comprar dolares metro santa isabel",
    "casa de cambio cerca santa isabel",
    "divisas santa isabel santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-metro-santa-isabel",
  },
  openGraph: {
    title: "Casa de Cambio Metro Santa Isabel | Gamaex Providencia",
    description: "Cambio de divisas cerca de Metro Santa Isabel. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-metro-santa-isabel",
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

export default async function CasaDeCambioMetroSantaIsabelPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
