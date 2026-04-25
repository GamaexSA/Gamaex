import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Best Exchange Rate Santiago", item: "https://www.gamaex.cl/best-exchange-rate-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Best Exchange Rate in Santiago Chile | No fees — Gamaex",
  description:
    "Get the best currency exchange rate in Santiago at Gamaex, Providencia. USD, EUR, BRL and 40+ currencies. No hidden fees. 38 years of experience near Metro Pedro de Valdivia.",
  keywords: [
    "best exchange rate santiago",
    "best currency exchange santiago chile",
    "currency exchange no fees santiago",
    "best place to exchange money santiago",
    "USD CLP best rate santiago",
    "no commission currency exchange chile",
    "best money exchange providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/best-exchange-rate-santiago",
  },
  openGraph: {
    title: "Best Exchange Rate Santiago | No fees — Gamaex",
    description: "Best currency exchange rates in Santiago, Chile. No hidden fees. Gamaex Providencia.",
    url: "https://www.gamaex.cl/best-exchange-rate-santiago",
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

export default async function BestExchangeRateSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Best currency exchange in ", h1Accent: "Santiago", heroDesc: "Get the best USD, EUR and 40+ currency exchange rates in Santiago at Gamaex, Providencia. No fees, live rates, 38 years of experience." }} />
    </>
  );
}
