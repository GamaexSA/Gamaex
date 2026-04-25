import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Vitacura", item: "https://www.gamaex.cl/casa-de-cambio-vitacura" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Cerca de Vitacura | Gamaex — Providencia, Santiago",
  description:
    "La opción más conveniente para cambiar divisas cerca de Vitacura es Gamaex en Providencia. +40 monedas, 38 años de trayectoria, precios transparentes. A minutos en Metro Línea 1.",
  keywords: [
    "casa de cambio vitacura",
    "cambio moneda vitacura",
    "cambio divisas vitacura santiago",
    "donde cambiar moneda vitacura",
    "casa de cambio cerca de vitacura",
    "cambio dolar vitacura",
    "mejor casa de cambio vitacura",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-vitacura",
  },
  openGraph: {
    title: "Casa de Cambio Cerca de Vitacura | Gamaex Chile",
    description:
      "La casa de cambio más cercana a Vitacura — Gamaex en Providencia. +40 divisas, 38 años.",
    url: "https://www.gamaex.cl/casa-de-cambio-vitacura",
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

export default async function CasaDeCambioVitacuraPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
