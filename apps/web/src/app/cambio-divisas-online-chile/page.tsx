import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Divisas Online Chile", item: "https://www.gamaex.cl/cambio-divisas-online-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Divisas Online Chile | Cotización en Tiempo Real — Gamaex",
  description:
    "Consulta las cotizaciones de divisas online en Chile. Gamaex publica precios en tiempo real. Cotiza por WhatsApp y opera en nuestro local de Providencia sin comisiones.",
  keywords: [
    "cambio divisas online chile",
    "cotizacion divisas online chile",
    "tipo de cambio online chile",
    "precio divisas online santiago",
    "cambio moneda online chile",
    "cotizacion dolar online chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-divisas-online-chile",
  },
  openGraph: {
    title: "Cambio Divisas Online Chile | Gamaex",
    description: "Cotizaciones de divisas online en Gamaex Chile. Consulta precios y opera sin comisiones.",
    url: "https://www.gamaex.cl/cambio-divisas-online-chile",
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

export default async function CambioDivisasOnlineChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cotización de divisas ", h1Accent: "online en Chile", heroDesc: "Precios de divisas en tiempo real en Gamaex Chile. Consulta el tipo de cambio, cotiza por WhatsApp y opera en Providencia sin comisiones." }} />
    </>
  );
}
