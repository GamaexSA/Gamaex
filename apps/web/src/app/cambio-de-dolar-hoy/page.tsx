import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Dólar Hoy", item: "https://www.gamaex.cl/cambio-de-dolar-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Dólar Hoy · USD/CLP Actualizado",
  description:
    "Consulta el cambio de dólar hoy en Chile. Gamaex en Providencia actualiza el USD/CLP diariamente. Sin comisiones, precio real, atención directa.",
  keywords: [
    "cambio de dolar hoy",
    "cambio dolar hoy chile",
    "cuanto esta el dolar hoy",
    "precio dolar hoy chile",
    "tipo de cambio dolar hoy",
    "dolar hoy chile cotizacion",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-hoy-chile",
  },
  openGraph: {
    title: "Cambio de Dólar Hoy Chile | Gamaex",
    description: "USD/CLP actualizado hoy. Cambia dólares en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cambio-de-dolar-hoy",
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

export default async function CambioDeDolarHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de dólar ", h1Accent: "hoy en Chile", heroDesc: "USD/CLP actualizado hoy en Gamaex. Consulta el precio del dólar y cambia tus divisas en Providencia sin comisiones, sin sorpresas.", articleHeading: "¿A cuánto está el cambio de dólar hoy?", articleText: "En esta página puedes ver el cambio de dólar hoy en vivo: la tabla de tasas y la calculadora se actualizan con el precio del día, así sabes al instante cuántos pesos chilenos recibes por tus dólares o cuántos necesitas para comprarlos. En Gamaex operamos exactamente a ese valor, sin comisiones ni cargos ocultos, de modo que lo que ves en pantalla es lo que se paga en el mostrador. No hace falta reservar ni abrir cuenta.\n\nEl tipo de cambio del dólar frente al peso chileno se mueve todos los días, y varias veces dentro de la misma jornada. Depende de factores como el precio internacional del cobre, el valor global del dólar, las tasas de interés y el clima económico local y externo. Por eso no publicamos una cifra fija en este texto: el número real y vigente aparece en la tabla y la calculadora de esta página, que reflejan el precio del día.\n\nPara cambiar, acércate a nuestra casa de cambio en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1. Atendemos de forma presencial desde 1988. Para montos altos se solicita la cédula de identidad según la normativa UAF, y puedes escribirnos por WhatsApp para confirmar la disponibilidad de billetes antes de venir. La operación es inmediata: llegas, cambias y listo." }} />
    </>
  );
}
