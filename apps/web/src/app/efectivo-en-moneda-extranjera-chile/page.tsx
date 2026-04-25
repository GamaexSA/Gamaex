import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Efectivo en Moneda Extranjera Chile", item: "https://www.gamaex.cl/efectivo-en-moneda-extranjera-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Efectivo en Moneda Extranjera en Chile | Gamaex Providencia",
  description:
    "Obtén efectivo en moneda extranjera en Chile. Gamaex en Providencia entrega USD, EUR, GBP, BRL y más de 40 divisas en efectivo. Sin comisiones, atención directa.",
  keywords: [
    "efectivo moneda extranjera chile",
    "comprar divisas en efectivo santiago",
    "donde obtener dolares en efectivo chile",
    "euros en efectivo santiago",
    "moneda extranjera efectivo providencia",
    "cambio divisas efectivo chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/efectivo-en-moneda-extranjera-chile",
  },
  openGraph: {
    title: "Efectivo en Moneda Extranjera Chile | Gamaex",
    description: "Divisas en efectivo en Gamaex Providencia. USD, EUR y +40 monedas. Sin comisiones.",
    url: "https://www.gamaex.cl/efectivo-en-moneda-extranjera-chile",
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

export default async function EfectivoMonedaExtranjeraChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Efectivo en ", h1Accent: "moneda extranjera", heroDesc: "Obtén efectivo en moneda extranjera en Chile. Gamaex en Providencia entrega USD, EUR, GBP y +40 divisas en efectivo, sin comisiones." }} />
    </>
  );
}
