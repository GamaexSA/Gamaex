import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Exchange Rate Chile Today", item: "https://www.gamaex.cl/exchange-rate-chile-today" },
  ],
});

export const metadata: Metadata = {
  title: "Exchange Rate Chile Today | USD CLP EUR — Gamaex",
  description:
    "Live exchange rates in Chile today. USD/CLP, EUR/CLP and 40+ currencies at Gamaex, Providencia. No fees, best rates, 38 years of experience. Walk in or check online.",
  keywords: [
    "exchange rate chile today",
    "USD CLP rate today",
    "EUR CLP rate chile",
    "currency exchange rate santiago",
    "dollar rate chile today",
    "best exchange rate chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/exchange-rate-chile-today",
  },
  openGraph: {
    title: "Exchange Rate Chile Today | Gamaex Providencia",
    description: "Live USD/CLP and EUR/CLP rates at Gamaex Providencia. No fees.",
    url: "https://www.gamaex.cl/exchange-rate-chile-today",
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

export default async function ExchangeRateChileTodayPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
