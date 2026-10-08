import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Dólar Peso Chileno", item: "https://www.gamaex.cl/cambio-dolar-peso-chileno" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Dólar Peso Chileno · USD/CLP Hoy",
  description:
    "Cambio de dólar a peso chileno en Gamaex. Precio USD/CLP actualizado, sin comisiones ocultas. Calcula la conversión y consulta por WhatsApp.",
  keywords: [
    "cambio dolar peso chileno",
    "USD CLP tipo de cambio",
    "dolar a peso chileno hoy",
    "convertir dolar a peso chileno",
    "precio dolar en pesos chilenos",
    "cambio USD CLP santiago",
    "dolar peso chileno conversor",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-peso-chileno",
  },
  openGraph: {
    title: "Cambio Dólar Peso Chileno | USD/CLP — Gamaex",
    description: "Precio USD/CLP actualizado en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/cambio-dolar-peso-chileno",
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

export default async function CambioDolarPesoChilenoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio dólar · ", h1Accent: "peso chileno", heroDesc: "Cotización USD/CLP actualizada en Gamaex, Providencia. Compra y venta de dólares a pesos chilenos sin comisiones.", articleHeading: "¿A cuántos pesos chilenos equivale un dólar hoy?", articleText: "Para saber a cuántos pesos chilenos equivale un dólar hoy, mira la tabla de tasas y la calculadora en vivo de esta página: muestran el precio del día del par USD/CLP, tanto si compras como si vendes dólares. Con la calculadora conviertes el monto exacto en segundos. En Gamaex cambias a ese valor publicado, sin comisiones, en persona y sin reservar ni abrir cuenta.\n\nLa relación entre el dólar y el peso chileno cambia a diario porque responde a un mercado dinámico. Pesan factores como el precio internacional del cobre, la fuerza global del dólar, las tasas de interés y el clima económico dentro y fuera de Chile. Por eso no escribimos un número fijo aquí: el valor real del cambio USD/CLP siempre estará actualizado en la calculadora y la tabla de esta página, reflejando el precio del día.\n\nCuando quieras concretar, visítanos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1. Gamaex es una casa de cambio familiar en funcionamiento desde 1988, con atención presencial y más de 40 divisas. Para montos altos se solicita la cédula de identidad conforme a la normativa UAF, y puedes escribirnos por WhatsApp para confirmar los billetes antes de tu visita. La operación es inmediata, sin trámites de banco." }} />
    </>
  );
}
