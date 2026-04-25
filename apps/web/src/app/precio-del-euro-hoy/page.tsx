import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio del Euro Hoy", item: "https://www.gamaex.cl/precio-del-euro-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Precio del Euro Hoy en Chile | EUR CLP — Gamaex",
  description:
    "Precio del euro hoy en Chile actualizado en Gamaex. EUR/CLP de compra y venta. Sin comisiones, precio real, Providencia. Calculadora de divisas incluida.",
  keywords: [
    "precio del euro hoy",
    "precio del euro hoy en chile",
    "EUR CLP hoy",
    "cotizacion euro hoy chile",
    "cuanto esta el euro hoy chile",
    "precio euro chile hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-del-euro-hoy",
  },
  openGraph: {
    title: "Precio del Euro Hoy Chile | Gamaex",
    description: "EUR/CLP actualizado hoy. Cambia euros en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/precio-del-euro-hoy",
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

export default async function PrecioDelEuroHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio del euro ", h1Accent: "hoy en Chile", heroDesc: "EUR/CLP de compra y venta actualizado hoy en Gamaex. Consulta el precio del euro y cambia tus divisas en Providencia sin comisiones.", articleText: "El precio del euro en Chile se determina por las condiciones del mercado cambiario europeo y su relación con el peso chileno. Gamaex publica el EUR/CLP actualizado para compra y venta todos los días hábiles. La calculadora de esta página te permite estimar cuántos pesos chilenos recibirías por tus euros antes de visitar el local." }} />
    </>
  );
}
