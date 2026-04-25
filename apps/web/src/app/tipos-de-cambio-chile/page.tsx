import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Tipos de Cambio Chile", item: "https://www.gamaex.cl/tipos-de-cambio-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Tipos de Cambio en Chile Hoy | USD EUR BRL — Gamaex",
  description:
    "Consulta los tipos de cambio en Chile hoy. USD/CLP, EUR/CLP, BRL/CLP y +40 divisas actualizadas en Gamaex Providencia. Sin comisiones, precio real.",
  keywords: [
    "tipos de cambio chile",
    "tipos de cambio hoy chile",
    "tabla tipos de cambio chile",
    "divisas chile hoy cotizacion",
    "monedas extranjeras chile precios",
    "cambio divisas chile tabla",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/tipos-de-cambio-chile",
  },
  openGraph: {
    title: "Tipos de Cambio Chile Hoy | Gamaex",
    description: "USD/CLP, EUR/CLP y +40 tipos de cambio actualizados hoy en Gamaex Chile.",
    url: "https://www.gamaex.cl/tipos-de-cambio-chile",
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

export default async function TiposDeCambioChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Tipos de cambio en ", h1Accent: "Chile hoy", heroDesc: "Más de 40 tipos de cambio actualizados hoy en Gamaex. USD/CLP, EUR/CLP, BRL/CLP y muchas más divisas disponibles en Providencia sin comisiones.", articleText: "La tabla de tipos de cambio de Gamaex muestra los precios de compra y venta para más de 40 divisas. Los valores se actualizan todos los días hábiles y reflejan las condiciones reales del mercado cambiario chileno. Para operar, visita el local en Av. Pedro de Valdivia 020, Providencia, o consulta por WhatsApp antes de ir." }} />
    </>
  );
}
