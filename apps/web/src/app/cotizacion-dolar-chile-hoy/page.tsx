import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cotización Dólar Chile Hoy", item: "https://www.gamaex.cl/cotizacion-dolar-chile-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cotización Dólar Chile Hoy · USD/CLP",
  description:
    "Cotización del dólar en Chile hoy. Precio USD/CLP de compra y venta actualizado diariamente en Gamaex Providencia. Calcula en nuestra calculadora.",
  keywords: [
    "cotizacion dolar chile hoy",
    "cotizacion USD CLP hoy",
    "precio dolar chile hoy compra",
    "cotizacion dolar santiago hoy",
    "dolar chileno cotizacion hoy",
    "cotizacion dolar peso chileno",
    "cuanto esta el dolar hoy chile compra venta",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-dolar-hoy-chile",
  },
  openGraph: {
    title: "Cotización Dólar Chile Hoy | USD/CLP — Gamaex",
    description: "Cotización USD/CLP actualizada hoy. Gamaex Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/cotizacion-dolar-chile-hoy",
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

export default async function CotizacionDolarChileHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cotización dólar ", h1Accent: "Chile hoy", heroDesc: "Cotización del dólar en Chile actualizada hoy. Consulta el USD/CLP y cambia tus divisas en Gamaex Providencia sin comisiones.", articleHeading: "¿Cuál es la cotización del dólar en Chile hoy?", articleText: "La cotización del dólar en Chile hoy está publicada en vivo en esta página. La tabla de tasas y la calculadora reflejan el precio del día para comprar y vender, así que puedes conocer al instante el valor actualizado en pesos chilenos. En Gamaex cambias a esa misma cotización, sin comisiones, de forma presencial. No necesitas reservar ni abrir una cuenta: la operación es directa e inmediata.\n\nLa cotización del dólar en Chile se mueve a diario porque depende de un conjunto de factores en constante cambio: el precio internacional del cobre, la fortaleza global del dólar, las tasas de interés y el contexto económico nacional e internacional. Por eso mostramos el número real en la propia página en vez de una cifra escrita que quedaría obsoleta. Revisa la calculadora para ver la cotización vigente antes de tu cambio.\n\nTe esperamos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1. Gamaex es una casa de cambio familiar que opera desde 1988 y atiende de manera presencial, con más de 40 divisas disponibles. Para montos altos pedimos la cédula de identidad conforme a la normativa UAF, y puedes escribirnos por WhatsApp para confirmar la disponibilidad de los billetes. Cambias rápido, sin trámites propios de un banco." }} />
    </>
  );
}
