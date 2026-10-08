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
  title: "Exchange Rate Chile Today · USD EUR CLP",
  description:
    "Live exchange rates in Chile today. USD/CLP, EUR/CLP and 40+ currencies at Gamaex, Providencia. No fees, 38 years of experience.",
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
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Live exchange rate ", h1Accent: "Chile today", heroDesc: "Live USD/CLP, EUR/CLP and 40+ currency rates at Gamaex, Providencia. No fees, walk-in service, 38 years of experience.", articleHeading: "What is the exchange rate in Chile today?", articleText: "Wondering what the exchange rate in Chile is today? You can see it live on this page. The rate table and the calculator show today's price for the US dollar, the euro and more than 40 currencies, so you instantly know how many Chilean pesos you get for your money. At Gamaex you exchange at that same published rate, with no commissions. There is no need to book an appointment or open an account.\n\nExchange rates move every day, and sometimes within the same day, driven by the international copper price, the global strength of the dollar, interest rates and the wider economic climate. That is why we show the current figure on the page itself instead of printing a number that would quickly go out of date. Check the live calculator before you come so you arrive with a clear idea of your exchange.\n\nYou will find us at Av. Pedro de Valdivia 020, Providencia, Santiago, just steps from the Pedro de Valdivia Metro station on Line 1. Gamaex is a family-run exchange house that has served customers in person since 1988. Please bring your ID or passport, as larger amounts require identification under Chile's UAF regulations, and feel free to message us on WhatsApp beforehand to confirm we have the notes you need. The exchange is done on the spot, quickly and without bank paperwork." }} />
    </>
  );
}
