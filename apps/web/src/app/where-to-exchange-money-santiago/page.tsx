import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Where to Exchange Money Santiago", item: "https://www.gamaex.cl/where-to-exchange-money-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Where to Exchange Money in Santiago Chile | Gamaex",
  description:
    "Looking for where to exchange money in Santiago, Chile? Gamaex in Providencia offers 40+ currencies, no commission, and 38 years of trusted service near Metro Pedro de Valdivia.",
  keywords: [
    "where to exchange money santiago chile",
    "best place to exchange money santiago",
    "currency exchange in santiago chile",
    "exchange money providencia santiago",
    "change money santiago chile",
    "foreign exchange santiago",
    "casa de cambio english santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/where-to-exchange-money-santiago",
  },
  openGraph: {
    title: "Where to Exchange Money in Santiago | Gamaex — No fees",
    description: "Trusted currency exchange in Providencia, Santiago. 40+ currencies, no fees. Gamaex.",
    url: "https://www.gamaex.cl/where-to-exchange-money-santiago",
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

export default async function WhereToExchangeMoneySantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Where to exchange ", h1Accent: "money in Santiago", heroDesc: "The best place to exchange money in Santiago. Gamaex at Av. Pedro de Valdivia 020, Providencia — no fees, 40+ currencies, 38 years.", articleText: "The best place to exchange money in Santiago is Gamaex at Av. Pedro de Valdivia 020, Providencia — just steps from Metro Pedro de Valdivia (Line 1). Open weekdays 9am–5:30pm and Saturdays 9am–1pm. Bring cash and leave with 40+ currencies at competitive rates, zero fees." }} />
    </>
  );
}
