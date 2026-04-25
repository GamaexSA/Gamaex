import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Dólar Santiago Hoy", item: "https://www.gamaex.cl/precio-dolar-santiago-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Dólar Santiago Hoy | USD/CLP — Gamaex Providencia",
  description:
    "Precio del dólar hoy en Santiago. Gamaex publica los valores de compra y venta USD/CLP actualizados diariamente. Sin comisiones, atención en Providencia.",
  keywords: [
    "precio dolar santiago hoy",
    "valor dolar santiago hoy",
    "dolar hoy santiago chile",
    "USD CLP precio hoy",
    "tipo de cambio dolar santiago",
    "cotizacion dolar hoy santiago",
    "comprar vender dolar santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-dolar-santiago-hoy",
  },
  openGraph: {
    title: "Precio Dólar Santiago Hoy | USD/CLP — Gamaex",
    description: "Precio del dólar hoy en Santiago, actualizado diariamente en Gamaex Providencia.",
    url: "https://www.gamaex.cl/precio-dolar-santiago-hoy",
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

export default async function PrecioDolarSantiagoHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio dólar hoy en ", h1Accent: "Santiago", heroDesc: "Precio del dólar en Santiago actualizado hoy. Consulta el USD/CLP y cambia tus divisas en Gamaex Providencia sin comisiones." }} />
    </>
  );
}
