import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Dólar Hoy Chile", item: "https://www.gamaex.cl/precio-dolar-hoy-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Dólar Hoy en Chile | Gamaex — Tipo de Cambio USD/CLP",
  description:
    "Consulta el precio del dólar hoy en Chile con Gamaex. Tipo de cambio USD/CLP actualizado. Compra y vende dólares al mejor precio en Providencia, sin comisiones ocultas.",
  keywords: [
    "precio dolar hoy chile",
    "tipo de cambio dolar chile hoy",
    "dolar hoy santiago",
    "cuanto esta el dolar hoy chile",
    "precio dolar compra venta hoy",
    "tipo de cambio USD CLP hoy",
    "cotizacion dolar chile",
    "valor dolar hoy providencia",
    "precio dolar bancario chile",
    "dolar observado hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-dolar-hoy-chile",
  },
  openGraph: {
    title: "Precio Dólar Hoy en Chile | Tipo de Cambio USD/CLP — Gamaex",
    description:
      "Tipo de cambio USD/CLP actualizado. Compra y vende dólares al mejor precio en Gamaex Providencia.",
    url: "https://www.gamaex.cl/precio-dolar-hoy-chile",
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

export default async function PrecioDolarHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
