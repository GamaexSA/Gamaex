import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Metro Los Leones", item: "https://www.gamaex.cl/casa-de-cambio-metro-los-leones" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Metro Los Leones | Gamaex — Divisas en Providencia",
  description:
    "Casa de cambio a pasos de Metro Los Leones. Gamaex en Av. Pedro de Valdivia 020, Providencia — a metros de la salida Los Leones. Sin comisiones, 38 años de experiencia.",
  keywords: [
    "casa de cambio metro los leones",
    "cambio divisas los leones providencia",
    "comprar dolares metro los leones",
    "casa de cambio cerca metro los leones",
    "divisas los leones providencia",
    "cambio moneda los leones santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-metro-los-leones",
  },
  openGraph: {
    title: "Casa de Cambio Metro Los Leones | Gamaex Providencia",
    description: "Cambio de divisas a pasos del Metro Los Leones. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-metro-los-leones",
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

export default async function CasaDeCambioMetroLosLeonesPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
