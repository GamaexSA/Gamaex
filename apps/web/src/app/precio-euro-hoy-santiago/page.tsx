import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Euro Hoy Santiago", item: "https://www.gamaex.cl/precio-euro-hoy-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Euro Hoy en Santiago | EUR/CLP — Gamaex Providencia",
  description:
    "Precio del euro hoy en Santiago. Gamaex publica el precio EUR/CLP de compra y venta diariamente. Sin comisiones, atención en Providencia.",
  keywords: [
    "precio euro hoy santiago",
    "valor euro santiago hoy",
    "EUR CLP precio hoy santiago",
    "cotizacion euro santiago hoy",
    "precio compra venta euro santiago",
    "cuanto vale el euro hoy santiago",
    "tipo de cambio euro santiago chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-euro-hoy-santiago",
  },
  openGraph: {
    title: "Precio Euro Hoy Santiago | EUR/CLP — Gamaex",
    description: "Precio del euro hoy en Santiago, actualizado diariamente. Gamaex Providencia.",
    url: "https://www.gamaex.cl/precio-euro-hoy-santiago",
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

export default async function PrecioEuroHoySantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio del euro hoy en ", h1Accent: "Santiago", heroDesc: "Precio del euro en Santiago actualizado hoy. Consulta el EUR/CLP y cambia tus divisas en Gamaex Providencia sin comisiones." }} />
    </>
  );
}
