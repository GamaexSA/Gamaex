import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Tobalaba", item: "https://www.gamaex.cl/casa-de-cambio-tobalaba" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Tobalaba | Gamaex — Divisas en Providencia",
  description:
    "Casa de cambio cerca de Metro Tobalaba. Gamaex en Av. Pedro de Valdivia 020, Providencia — a pocas cuadras de Tobalaba. Sin comisiones, 38 años de experiencia.",
  keywords: [
    "casa de cambio tobalaba",
    "cambio divisas tobalaba providencia",
    "comprar dolares tobalaba santiago",
    "casa de cambio cerca metro tobalaba",
    "divisas tobalaba providencia",
    "cambio moneda tobalaba santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-tobalaba",
  },
  openGraph: {
    title: "Casa de Cambio Tobalaba | Gamaex Providencia",
    description: "Cambio de divisas cerca de Metro Tobalaba. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-tobalaba",
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

export default async function CasaDeCambioTobalaba() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
