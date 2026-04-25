import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio del Dólar Hoy", item: "https://www.gamaex.cl/precio-del-dolar-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Precio del Dólar Hoy en Chile | USD CLP — Gamaex",
  description:
    "Precio del dólar hoy en Chile actualizado en Gamaex. USD/CLP de compra y venta para personas y empresas. Sin comisiones, precio real, Providencia.",
  keywords: [
    "precio del dolar hoy",
    "precio del dolar hoy en chile",
    "USD CLP hoy",
    "cotizacion dolar hoy chile",
    "cuanto esta el dolar hoy chile",
    "precio dolar chile hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-del-dolar-hoy",
  },
  openGraph: {
    title: "Precio del Dólar Hoy Chile | Gamaex",
    description: "USD/CLP actualizado hoy. Cambia dólares en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/precio-del-dolar-hoy",
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

export default async function PrecioDelDolarHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio del dólar ", h1Accent: "hoy en Chile", heroDesc: "USD/CLP de compra y venta actualizado hoy en Gamaex. Consulta el precio del dólar y cambia tus divisas en Providencia sin comisiones.", articleText: "El precio del dólar en Chile fluctúa según las condiciones del mercado cambiario internacional y la oferta y demanda local. Gamaex publica su cotización USD/CLP para compra y venta todos los días hábiles. La calculadora de esta página usa los precios del día para que puedas estimar el resultado de tu operación antes de ir al local." }} />
    </>
  );
}
