import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Euro Hoy Chile", item: "https://www.gamaex.cl/precio-euro-hoy-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Euro Hoy en Chile | Gamaex — Tipo de Cambio EUR/CLP",
  description:
    "Consulta el precio del euro hoy en Chile con Gamaex. Tipo de cambio EUR/CLP actualizado. Compra y vende euros al mejor precio en Providencia, sin comisiones ocultas.",
  keywords: [
    "precio euro hoy chile",
    "tipo de cambio euro chile hoy",
    "euro hoy santiago",
    "cuanto esta el euro hoy chile",
    "precio euro compra venta hoy",
    "tipo de cambio EUR CLP hoy",
    "cotizacion euro chile",
    "valor euro hoy providencia",
    "euro observado hoy chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-euro-hoy-chile",
  },
  openGraph: {
    title: "Precio Euro Hoy en Chile | Tipo de Cambio EUR/CLP — Gamaex",
    description:
      "Tipo de cambio EUR/CLP actualizado. Compra y vende euros al mejor precio en Gamaex Providencia.",
    url: "https://www.gamaex.cl/precio-euro-hoy-chile",
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

export default async function PrecioEuroHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio del euro ", h1Accent: "hoy en Chile", heroDesc: "Consulta el precio del euro hoy en Chile. Gamaex actualiza el EUR/CLP diariamente. Cambia en Providencia sin comisiones." }} />
    </>
  );
}
