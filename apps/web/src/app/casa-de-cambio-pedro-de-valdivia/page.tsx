import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Pedro de Valdivia", item: "https://www.gamaex.cl/casa-de-cambio-pedro-de-valdivia" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Pedro de Valdivia | Gamaex — Av. Pedro de Valdivia 020",
  description:
    "Gamaex en Av. Pedro de Valdivia 020, Providencia. La casa de cambio de referencia en la avenida Pedro de Valdivia — sin comisiones, +40 divisas, 38 años.",
  keywords: [
    "casa de cambio pedro de valdivia",
    "av pedro de valdivia casa de cambio",
    "cambio divisas av pedro de valdivia",
    "gamaex av pedro de valdivia",
    "casa de cambio pedro valdivia providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-pedro-de-valdivia",
  },
  openGraph: {
    title: "Casa de Cambio Pedro de Valdivia | Gamaex",
    description: "Gamaex en Av. Pedro de Valdivia 020, Providencia. Sin comisiones, 38 años.",
    url: "https://www.gamaex.cl/casa-de-cambio-pedro-de-valdivia",
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

export default async function CasaDeCambioPedrodeValdiviaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio en Av. ", h1Accent: "Pedro de Valdivia", heroDesc: "Gamaex en Av. Pedro de Valdivia 020, Providencia — la casa de cambio de referencia de la avenida. Sin comisiones, +40 divisas, 38 años." }} />
    </>
  );
}
