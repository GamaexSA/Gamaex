import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Dólares Hoy Santiago", item: "https://www.gamaex.cl/cambio-de-dolares-hoy-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Dólares Hoy en Santiago | USD/CLP — Gamaex",
  description:
    "Cambio de dólares hoy en Santiago. Precio USD/CLP de compra y venta actualizado en Gamaex Providencia. Sin comisiones ocultas, 38 años de experiencia.",
  keywords: [
    "cambio de dolares hoy santiago",
    "cambio dolares santiago hoy",
    "precio dolar hoy santiago compra venta",
    "donde cambiar dolares hoy santiago",
    "USD CLP hoy santiago",
    "cotizacion dolar hoy santiago",
    "tipo cambio dolares santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-de-dolares-hoy-santiago",
  },
  openGraph: {
    title: "Cambio de Dólares Hoy Santiago | USD/CLP — Gamaex",
    description: "Precio del dólar hoy en Santiago. Gamaex Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-de-dolares-hoy-santiago",
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

export default async function CambioDeDolaresHoySantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de dólares hoy en ", h1Accent: "Santiago", heroDesc: "Precio del dólar actualizado hoy en Santiago. Cambia USD en Gamaex, Providencia — sin comisiones, atención directa." }} />
    </>
  );
}
