import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Barrio Italia", item: "https://www.gamaex.cl/casa-de-cambio-barrio-italia" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Barrio Italia | Gamaex — Divisas en Santiago",
  description:
    "Casa de cambio cercana a Barrio Italia. Gamaex está en Providencia, a pocos minutos de Barrio Italia. Compra y venta de divisas, 38 años de experiencia.",
  keywords: [
    "casa de cambio barrio italia",
    "cambio de divisas barrio italia",
    "comprar dolares barrio italia",
    "casa de cambio cercana barrio italia",
    "cambio moneda providencia barrio italia",
    "divisas barrio italia santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-barrio-italia",
  },
  openGraph: {
    title: "Casa de Cambio Barrio Italia | Gamaex Providencia",
    description: "Cambio de divisas cercano a Barrio Italia. Gamaex en Providencia, 38 años de experiencia.",
    url: "https://www.gamaex.cl/casa-de-cambio-barrio-italia",
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

export default async function CasaDeCambioBarrioItaliaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
