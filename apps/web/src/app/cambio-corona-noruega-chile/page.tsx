import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Corona Noruega Chile", item: "https://www.gamaex.cl/cambio-corona-noruega-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Corona Noruega en Chile | NOK/CLP — Gamaex",
  description:
    "Compra y vende coronas noruegas en Gamaex, Providencia. Precio NOK/CLP actualizado, sin comisiones. 38 años de experiencia a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "cambio corona noruega chile",
    "comprar coronas noruegas santiago",
    "NOK CLP precio hoy",
    "tipo de cambio corona noruega chile",
    "corona noruega a peso chileno",
    "casa de cambio corona noruega",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-corona-noruega-chile",
  },
  openGraph: {
    title: "Cambio Corona Noruega Chile | NOK/CLP — Gamaex",
    description: "Precio NOK/CLP actualizado. Compra y venta en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-corona-noruega-chile",
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

export default async function CambioCoronaNoruegaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
