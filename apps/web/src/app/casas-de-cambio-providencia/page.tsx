import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casas de Cambio Providencia", item: "https://www.gamaex.cl/casas-de-cambio-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Casas de Cambio en Providencia | La Mejor — Gamaex",
  description:
    "Buscas casas de cambio en Providencia? Gamaex en Av. Pedro de Valdivia 020 es la referencia del sector — sin comisiones, +40 divisas, 38 años de trayectoria.",
  keywords: [
    "casas de cambio providencia",
    "casas de cambio en providencia santiago",
    "mejor casa de cambio providencia",
    "donde cambiar moneda providencia",
    "casas de cambio divisas providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casas-de-cambio-providencia",
  },
  openGraph: {
    title: "Casas de Cambio en Providencia | Gamaex",
    description: "La mejor casa de cambio en Providencia. Gamaex, sin comisiones, 38 años.",
    url: "https://www.gamaex.cl/casas-de-cambio-providencia",
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

export default async function CasasDeCambioProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "La mejor casa de cambio en ", h1Accent: "Providencia", heroDesc: "Gamaex en Av. Pedro de Valdivia 020 — la referencia en casas de cambio en Providencia. Sin comisiones, +40 divisas, 38 años." }} />
    </>
  );
}
