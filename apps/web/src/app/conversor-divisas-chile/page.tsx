import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Conversor de Divisas Chile", item: "https://www.gamaex.cl/conversor-divisas-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Conversor de Divisas Chile | Calculadora gratuita — Gamaex",
  description:
    "Conversor de divisas para Chile. Calcula USD, EUR, BRL y más de 40 monedas en pesos chilenos. Precios reales de Gamaex, actualizados diariamente.",
  keywords: [
    "conversor divisas chile",
    "convertir divisas chile",
    "calculadora divisas chile",
    "conversor moneda chilena",
    "convertir dolares a pesos chilenos",
    "convertir euros a pesos chilenos",
    "conversor cambio de moneda chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/conversor-divisas-chile",
  },
  openGraph: {
    title: "Conversor de Divisas Chile | Gamaex — Precios reales",
    description: "Conversor de divisas con precios reales de Gamaex. USD, EUR, BRL y 40+ monedas.",
    url: "https://www.gamaex.cl/conversor-divisas-chile",
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

export default async function ConversorDivisasChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
