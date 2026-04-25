import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Moneda Extranjera Chile", item: "https://www.gamaex.cl/cambio-moneda-extranjera-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Moneda Extranjera en Chile | +40 divisas — Gamaex",
  description:
    "Cambia moneda extranjera en Chile con Gamaex. Más de 40 divisas disponibles: dólares, euros, reales, yenes y más. Precios transparentes, sin comisiones, 38 años de experiencia.",
  keywords: [
    "cambio moneda extranjera chile",
    "donde cambiar moneda extranjera en chile",
    "casa de cambio moneda extranjera santiago",
    "cambiar divisas chile",
    "moneda extranjera providencia",
    "mejor cambio de moneda extranjera chile",
    "casa de cambio divisas chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-moneda-extranjera-chile",
  },
  openGraph: {
    title: "Cambio Moneda Extranjera Chile | +40 divisas — Gamaex",
    description: "Más de 40 divisas en Gamaex Providencia. Precios transparentes, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-moneda-extranjera-chile",
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

export default async function CambioMonedaExtranjeraChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de moneda ", h1Accent: "extranjera en Chile", heroDesc: "Más de 40 monedas extranjeras en Gamaex, Providencia. USD, EUR, GBP, BRL, JPY y más — sin comisiones, 38 años de experiencia." }} />
    </>
  );
}
