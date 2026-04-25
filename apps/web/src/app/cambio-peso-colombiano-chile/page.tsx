import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Peso Colombiano Chile", item: "https://www.gamaex.cl/cambio-peso-colombiano-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Peso Colombiano en Chile | COP CLP — Gamaex",
  description:
    "Cambia pesos colombianos en Chile. Gamaex en Providencia compra y vende COP al mejor precio. Sin comisiones, atención directa. 38 años de experiencia en divisas.",
  keywords: [
    "cambio peso colombiano chile",
    "COP CLP hoy",
    "precio peso colombiano chile",
    "comprar pesos colombianos santiago",
    "cambiar peso colombiano a peso chileno",
    "divisas colombianas chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-peso-colombiano-chile",
  },
  openGraph: {
    title: "Cambio Peso Colombiano Chile | Gamaex Providencia",
    description: "COP/CLP actualizado. Compra y venta de pesos colombianos en Gamaex sin comisiones.",
    url: "https://www.gamaex.cl/cambio-peso-colombiano-chile",
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

export default async function CambioPesoColombianoCilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
