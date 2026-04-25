import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Real Brasileño Hoy", item: "https://www.gamaex.cl/cambio-real-brasileno-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Real Brasileño Hoy Chile | BRL/CLP — Gamaex Providencia",
  description:
    "Precio del real brasileño hoy en Chile. Compra y vende BRL al mejor tipo de cambio en Gamaex, Providencia. Cotización actualizada, sin comisiones ocultas.",
  keywords: [
    "cambio real brasileño hoy chile",
    "tipo de cambio BRL CLP hoy",
    "precio real brasileño hoy santiago",
    "cotizacion real brasileño chile",
    "cambiar reales a pesos chilenos hoy",
    "BRL CLP precio hoy",
    "real a peso chileno tipo de cambio",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-real-brasileno-hoy",
  },
  openGraph: {
    title: "Cambio Real Brasileño Hoy Chile | BRL/CLP — Gamaex",
    description: "Cotización BRL/CLP actualizada. Compra y venta de reales en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-real-brasileno-hoy",
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

export default async function CambioRealBrasilenoHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio real brasileño ", h1Accent: "hoy Chile", heroDesc: "Cotización BRL/CLP actualizada hoy. Cambia reales brasileños en Gamaex Providencia sin comisiones." }} />
    </>
  );
}
