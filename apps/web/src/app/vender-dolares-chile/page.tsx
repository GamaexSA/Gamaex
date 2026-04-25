import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Vender Dólares Chile", item: "https://www.gamaex.cl/vender-dolares-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Vender Dólares en Chile | USD/CLP — Gamaex Providencia",
  description:
    "Vende tus dólares en Gamaex, Providencia. Obtenemos el mejor precio USD/CLP del mercado. Sin comisiones, 38 años de experiencia. A pasos del Metro Pedro de Valdivia.",
  keywords: [
    "vender dolares chile",
    "donde vender dolares en chile",
    "vender dolares santiago providencia",
    "precio compra dolar chile hoy",
    "USD CLP venta",
    "cambiar dolares a pesos chile",
    "mejor precio compra dolar chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/vender-dolares-chile",
  },
  openGraph: {
    title: "Vender Dólares Chile | USD/CLP — Gamaex",
    description: "Vende tus dólares al mejor precio en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/vender-dolares-chile",
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

export default async function VenderDolaresChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Vender dólares en ", h1Accent: "Chile", heroDesc: "Vende tus dólares en Chile al mejor precio. Gamaex en Providencia — pago inmediato, sin comisiones, cotización USD/CLP justa." }} />
    </>
  );
}
