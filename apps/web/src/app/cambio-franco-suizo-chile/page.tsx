import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Franco Suizo Chile", item: "https://www.gamaex.cl/cambio-franco-suizo-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Franco Suizo en Chile | CHF/CLP — Gamaex Providencia",
  description:
    "Compra y vende francos suizos en Gamaex, Providencia. Precio CHF/CLP actualizado, sin comisiones. 38 años de experiencia a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "cambio franco suizo chile",
    "comprar francos suizos santiago",
    "vender francos suizos chile",
    "CHF CLP precio hoy",
    "tipo de cambio franco suizo chile",
    "cotizacion franco suizo santiago",
    "casa de cambio franco suizo",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-franco-suizo-chile",
  },
  openGraph: {
    title: "Cambio Franco Suizo Chile | CHF/CLP — Gamaex",
    description: "Precio CHF/CLP actualizado. Compra y venta de francos suizos en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-franco-suizo-chile",
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

export default async function CambioFrancoSuizoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio franco ", h1Accent: "suizo en Chile", heroDesc: "Compra y venta de franco suizo (CHF) en Gamaex, Providencia. Cotización CHF/CLP actualizada, sin comisiones, atención directa." }} />
    </>
  );
}
