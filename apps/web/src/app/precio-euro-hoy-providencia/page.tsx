import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Euro Hoy Providencia", item: "https://www.gamaex.cl/precio-euro-hoy-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Euro Hoy en Providencia | Gamaex — EUR CLP",
  description:
    "Precio del euro hoy en Providencia. Gamaex en Av. Pedro de Valdivia 020 actualiza el EUR/CLP diariamente. Sin comisiones, atención directa.",
  keywords: [
    "precio euro hoy providencia",
    "cotizacion euro providencia",
    "tipo de cambio euro providencia",
    "euro hoy providencia santiago",
    "EUR CLP providencia hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-euro-hoy-providencia",
  },
  openGraph: {
    title: "Precio Euro Hoy Providencia | Gamaex",
    description: "Cotización EUR/CLP actualizada en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/precio-euro-hoy-providencia",
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

export default async function PrecioEuroHoyProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio del euro hoy en ", h1Accent: "Providencia", heroDesc: "EUR/CLP actualizado hoy en Gamaex Providencia. Consulta el precio del euro y cambia tus divisas sin comisiones." }} />
    </>
  );
}
