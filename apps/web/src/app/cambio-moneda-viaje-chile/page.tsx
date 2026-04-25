import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Moneda Viaje Chile", item: "https://www.gamaex.cl/cambio-moneda-viaje-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Moneda para Viaje en Chile | Gamaex — Divisas",
  description:
    "Cambia moneda para tu viaje en Gamaex, Providencia. USD, EUR, GBP, BRL y más de 40 divisas al mejor precio. Sin comisiones, atención directa. Lleva el efectivo que necesitas.",
  keywords: [
    "cambio moneda viaje chile",
    "donde cambiar moneda para viajar chile",
    "divisas para viaje santiago",
    "comprar moneda extranjera viaje",
    "cambio divisas antes de viajar",
    "moneda extranjera viaje providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-moneda-viaje-chile",
  },
  openGraph: {
    title: "Cambio de Moneda para Viaje | Gamaex Chile",
    description: "Prepara las divisas para tu viaje en Gamaex Providencia. Más de 40 monedas, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-moneda-viaje-chile",
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

export default async function CambioMonedaViajeChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Divisas para tu ", h1Accent: "viaje desde Chile", heroDesc: "Prepara las divisas para tu próximo viaje en Gamaex, Providencia. USD, EUR, BRL y +40 monedas al mejor precio, sin comisiones." }} />
    </>
  );
}
