import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Currency Exchange Near Me Santiago", item: "https://www.gamaex.cl/currency-exchange-near-me-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Currency Exchange Near Me Santiago | Gamaex — Providencia",
  description:
    "Looking for currency exchange near you in Santiago? Gamaex in Providencia: 38 years of experience, 40+ currencies, transparent rates, no hidden fees. Steps from Metro Pedro de Valdivia (Line 1).",
  keywords: [
    "currency exchange near me santiago",
    "forex exchange near me santiago chile",
    "money changer near me santiago",
    "closest currency exchange santiago",
    "currency exchange open now santiago",
    "best currency exchange near me chile",
    "exchange money near costanera center",
    "currency exchange providencia near metro",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/currency-exchange-near-me-santiago",
  },
  openGraph: {
    title: "Currency Exchange Near Me — Santiago | Gamaex Providencia",
    description:
      "The nearest currency exchange in Providencia/Santiago. 38 years, 40+ currencies, no fees. Metro Line 1.",
    url: "https://www.gamaex.cl/currency-exchange-near-me-santiago",
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

export default async function CurrencyExchangeNearMePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
