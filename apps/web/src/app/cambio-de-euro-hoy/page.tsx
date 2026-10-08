import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Euro Hoy", item: "https://www.gamaex.cl/cambio-de-euro-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Euro Hoy · EUR/CLP Actualizado",
  description:
    "Consulta el cambio de euro hoy en Chile. Gamaex en Providencia actualiza el EUR/CLP diariamente. Sin comisiones, precio real, atención directa.",
  keywords: [
    "cambio de euro hoy",
    "cambio euro hoy chile",
    "cuanto esta el euro hoy en chile",
    "precio euro hoy chile",
    "tipo de cambio euro hoy chile",
    "euro hoy chile cotizacion",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-de-euro-hoy",
  },
  openGraph: {
    title: "Cambio de Euro Hoy Chile | Gamaex",
    description: "EUR/CLP actualizado hoy. Cambia euros en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cambio-de-euro-hoy",
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

export default async function CambioDeEuroHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de euro ", h1Accent: "hoy en Chile", heroDesc: "EUR/CLP actualizado hoy en Gamaex. Consulta el precio del euro y cambia tus divisas en Providencia sin comisiones.", articleHeading: "¿Por qué el cambio de euro cambia cada día?", articleText: "El valor del euro frente al peso chileno se mueve todos los días porque depende de los mercados internacionales, que operan de forma continua. Por eso no existe un precio fijo para toda la semana: la referencia de hoy puede ser distinta a la de ayer. Lo importante es consultar el valor actualizado justo antes de cambiar, y no guiarte por una cifra que viste hace días en otro lugar.\n\nEn Gamaex publicamos el precio del euro del día y lo actualizamos a diario. Puedes verlo en vivo en la tabla de tasas y probar cuánto recibes con la calculadora de esta página: ingresas el monto en euros y te muestra el equivalente en pesos con la tasa vigente. Todo sin comisiones ni cargos ocultos, así que el número que aparece es el que trabajamos en el mostrador.\n\nSi quieres asegurar la operación, escríbenos por WhatsApp para confirmar la disponibilidad de billetes del día. Nos encuentras en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1, con atención presencial desde 1988 y sin reserva previa. Para montos altos pedimos cédula de identidad y registramos la operación según la normativa de la UAF. No somos banco: cambias tus euros en el momento, sin abrir cuenta ni trámites largos." }} />
    </>
  );
}
