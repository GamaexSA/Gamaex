import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Calculadora de Divisas Chile", item: "https://www.gamaex.cl/calculadora-divisas-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Calculadora de Divisas Chile | Conversor de Monedas — Gamaex",
  description:
    "Calcula cuántos pesos chilenos recibirás por tus divisas con la calculadora de Gamaex. +40 monedas disponibles. Precios reales actualizados. Casa de cambio en Providencia, Santiago.",
  keywords: [
    "calculadora divisas chile",
    "calculadora de monedas chile",
    "conversor de moneda chile",
    "calculadora dolar peso chileno",
    "convertir USD a CLP",
    "cuanto son mis dolares en pesos chilenos",
    "conversor divisas santiago",
    "calculadora tipo de cambio chile",
    "calculadora cambio moneda providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/calculadora-divisas-chile",
  },
  openGraph: {
    title: "Calculadora de Divisas Chile | Gamaex — Conversor de Monedas",
    description:
      "+40 monedas, precios reales. Calcula cuánto recibirás antes de venir a Gamaex Providencia.",
    url: "https://www.gamaex.cl/calculadora-divisas-chile",
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

export default async function CalculadoraDivisasChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
