import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Real Brasileño Hoy", item: "https://www.gamaex.cl/cambio-real-brasileno-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Real Brasileño Hoy en Chile · BRL/CLP",
  description:
    "Precio del real brasileño hoy en Chile. Compra y vende BRL al mejor tipo de cambio en Gamaex, Providencia. Cotización actualizada, sin comisiones ocultas.",
  keywords: [
    "cambio real brasileño hoy chile",
    "tipo de cambio BRL CLP hoy",
    "precio real brasileño hoy santiago",
    "cotizacion real brasileño chile",
    "cambiar reales a pesos chilenos hoy",
    "BRL CLP precio hoy",
    "real a peso chileno tipo de cambio",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-real-brasileno-hoy",
  },
  openGraph: {
    title: "Cambio Real Brasileño Hoy Chile | BRL/CLP — Gamaex",
    description: "Cotización BRL/CLP actualizada. Compra y venta de reales en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-real-brasileno-hoy",
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

export default async function CambioRealBrasilenoHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio real brasileño ", h1Accent: "hoy Chile", heroDesc: "Cotización BRL/CLP actualizada hoy. Cambia reales brasileños en Gamaex Providencia sin comisiones.", articleHeading: "¿Cuánto vale el real brasileño hoy en Chile?", articleText: "El valor del real brasileño frente al peso chileno cambia día a día, porque depende de los mercados internacionales que operan de manera continua. Por eso no sirve guiarse por una cifra de la semana pasada: lo correcto es consultar el precio del día antes de cambiar. Ya sea que vuelvas de Brasil con reales o que quieras comprarlos para un próximo viaje, la referencia siempre es la tasa vigente de la jornada.\n\nEn Gamaex publicamos el valor del real del día y lo actualizamos a diario. Puedes verlo en vivo en la tabla de tasas y estimar tu operación con la calculadora de esta página, ingresando el monto para saber el equivalente en pesos. Trabajamos sin comisiones ni cargos ocultos, así que el número publicado es con el que operamos en el mostrador. Como el real no siempre está en stock, escríbenos por WhatsApp para confirmar disponibilidad de billetes.\n\nAtendemos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1, de forma presencial desde 1988 y sin reserva previa. Para montos altos pedimos tu cédula de identidad y registramos la operación según la normativa de la UAF. No somos banco: cambias tus reales en el momento, en efectivo y sin necesidad de abrir cuenta ni hacer trámites largos." }} />
    </>
  );
}
