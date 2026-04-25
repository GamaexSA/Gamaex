import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Dólar Hoy Providencia", item: "https://www.gamaex.cl/precio-dolar-hoy-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Dólar Hoy en Providencia | Gamaex — USD en Tiempo Real",
  description:
    "Consulta el precio del dólar hoy en Providencia. Gamaex actualiza la cotización USD/CLP cada hora. Sin comisiones, atención directa en Av. Pedro de Valdivia 020.",
  keywords: [
    "precio dolar hoy providencia",
    "cotizacion dolar providencia",
    "tipo de cambio dolar providencia",
    "dolar hoy providencia santiago",
    "USD CLP providencia hoy",
    "comprar dolar providencia precio",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-dolar-hoy-providencia",
  },
  openGraph: {
    title: "Precio Dólar Hoy Providencia | Gamaex",
    description: "Cotización USD/CLP actualizada en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/precio-dolar-hoy-providencia",
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

export default async function PrecioDolarHoyProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
