import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Miraflores", item: "https://www.gamaex.cl/casa-de-cambio-miraflores" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Miraflores | Gamaex — Divisas en Providencia",
  description:
    "Casa de cambio cercana a Miraflores, Providencia. Gamaex en Av. Pedro de Valdivia 020, a pocos pasos de Miraflores. Compra y venta de más de 40 divisas, 38 años de experiencia.",
  keywords: [
    "casa de cambio miraflores",
    "cambio divisas miraflores providencia",
    "comprar dolares miraflores santiago",
    "casa de cambio cercana miraflores",
    "divisas miraflores providencia",
    "cambio de moneda miraflores santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-miraflores",
  },
  openGraph: {
    title: "Casa de Cambio Miraflores | Gamaex Providencia",
    description: "Cambio de divisas en Miraflores, Providencia. Gamaex, 38 años de experiencia.",
    url: "https://www.gamaex.cl/casa-de-cambio-miraflores",
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

export default async function CasaDeCambioMirafloresPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
