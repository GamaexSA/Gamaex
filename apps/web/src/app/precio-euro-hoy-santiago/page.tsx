import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Euro Hoy Santiago", item: "https://www.gamaex.cl/precio-euro-hoy-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Euro Hoy en Santiago · EUR/CLP",
  description:
    "Precio del euro hoy en Santiago. Gamaex publica el precio EUR/CLP de compra y venta diariamente. Sin comisiones, atención en Providencia.",
  keywords: [
    "precio euro hoy santiago",
    "valor euro santiago hoy",
    "EUR CLP precio hoy santiago",
    "cotizacion euro santiago hoy",
    "precio compra venta euro santiago",
    "cuanto vale el euro hoy santiago",
    "tipo de cambio euro santiago chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-euro-hoy-santiago",
  },
  openGraph: {
    title: "Precio Euro Hoy Santiago | EUR/CLP — Gamaex",
    description: "Precio del euro hoy en Santiago, actualizado diariamente. Gamaex Providencia.",
    url: "https://www.gamaex.cl/precio-euro-hoy-santiago",
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

export default async function PrecioEuroHoySantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio del euro hoy en ", h1Accent: "Santiago", heroDesc: "Precio del euro en Santiago actualizado hoy. Consulta el EUR/CLP y cambia tus divisas en Gamaex Providencia sin comisiones.", articleHeading: "¿Dónde ver el precio del euro hoy en Santiago?", articleText: "En Santiago el precio del euro cambia cada jornada, porque su valor frente al peso depende de los mercados internacionales. Por eso, más que buscar un número fijo, conviene mirar la referencia del día antes de cambiar. Quienes vuelven de Europa o preparan un viaje suelen comparar el precio en distintos puntos; lo clave es que el valor esté publicado y sin cargos añadidos que reduzcan lo que recibes.\n\nEn Gamaex mostramos el precio del euro del día, actualizado a diario, en la tabla de tasas de esta página, y puedes calcular tu operación con la calculadora ingresando el monto. Aplicamos ese valor sin comisiones ni cargos ocultos, así que lo que ves publicado es lo que trabajamos en persona. Si vas a cambiar una cantidad importante, escríbenos por WhatsApp para confirmar que tenemos los billetes disponibles y atenderte sin espera.\n\nAtendemos en Av. Pedro de Valdivia 020, comuna de Providencia, Santiago, a pasos del Metro Pedro de Valdivia de la Línea 1. Somos una casa de cambio familiar con atención presencial desde 1988 y sin reserva previa. Para montos altos pedimos tu cédula de identidad y registramos la operación según la normativa de la UAF. No somos banco: revisas el precio del día y cambias tus euros en el momento, en efectivo y sin abrir cuenta." }} />
    </>
  );
}
