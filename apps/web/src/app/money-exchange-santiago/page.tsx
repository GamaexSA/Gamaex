import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Money Exchange Santiago | Currency Exchange Providencia — Gamaex",
  description:
    "Best currency exchange in Providencia, Santiago. Gamaex: buy and sell USD, EUR, BRL and 40+ currencies near Metro Pedro de Valdivia. 38 years of experience. No hidden fees.",
  keywords: [
    "money exchange santiago",
    "currency exchange providencia",
    "money exchange near costanera center",
    "currency exchange pedro de valdivia",
    "USD CLP exchange santiago",
    "best exchange rate santiago chile",
    "currency exchange chile",
    "change money santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/money-exchange-santiago",
  },
  openGraph: {
    title: "Money Exchange Santiago | Gamaex — Providencia",
    description:
      "Best currency exchange rates in Providencia, Santiago. Near Metro Pedro de Valdivia. 38 years of experience. No fees.",
    url: "https://www.gamaex.cl/money-exchange-santiago",
  },
};

async function getRates(): Promise<PublicRatesResponse> {
  const empty: PublicRatesResponse = {
    rates: [],
    system_status: "stale",
    last_sync_at: "",
    cache_ttl_seconds: 60,
  };
  try {
    const url = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/rates/public`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return res.json() as Promise<PublicRatesResponse>;
  } catch {
    return empty;
  }
}

export default async function MoneyExchangePage() {
  const data = await getRates();
  return (
    <LandingPage
      rates={data.rates}
      systemStatus={data.system_status}
      lastSyncAt={data.last_sync_at}
    />
  );
}
