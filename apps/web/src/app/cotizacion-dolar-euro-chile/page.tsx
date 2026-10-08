import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cotización Dólar Euro Chile", item: "https://www.gamaex.cl/cotizacion-dolar-euro-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cotización Dólar y Euro Hoy · USD EUR CLP",
  description:
    "Cotización del dólar y el euro en Chile actualizada hoy. USD/CLP y EUR/CLP en Gamaex Providencia. Cambia sin comisiones, precio real diario.",
  keywords: [
    "cotizacion dolar euro chile",
    "cotizacion dolar y euro hoy",
    "USD EUR CLP hoy",
    "precio dolar euro chile hoy",
    "tipo de cambio dolar euro chile",
    "dolar euro chile hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cotizacion-dolar-euro-chile",
  },
  openGraph: {
    title: "Cotización Dólar y Euro Chile Hoy | Gamaex",
    description: "USD/CLP y EUR/CLP actualizados hoy. Cambia en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cotizacion-dolar-euro-chile",
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

export default async function CotizacionDolarEuroChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cotización dólar y euro en ", h1Accent: "Chile hoy", heroDesc: "USD/CLP y EUR/CLP actualizados diariamente en Gamaex. Consulta el precio del dólar y el euro y cambia en Providencia sin comisiones.", articleHeading: "¿Cómo consultar la cotización de dólar y euro hoy en Chile?", articleText: "Antes de cambiar moneda conviene conocer la cotización del día tanto del dólar como del euro, porque ambos valores se mueven de forma continua según los mercados internacionales. Comparar las dos referencias te ayuda a decidir cuánto cambiar de cada una, sobre todo si preparas un viaje con distintos destinos o si recibes pagos en más de una divisa. La cifra correcta es siempre la vigente, no una de días atrás.\n\nEn Gamaex publicamos la cotización del dólar y del euro del día y la actualizamos a diario. Puedes verlas en vivo en la tabla de tasas de esta página y probar cuánto recibes o cuánto necesitas con la calculadora, ingresando el monto en cada moneda. Trabajamos con el precio del día sin comisiones ni cargos ocultos, así que lo publicado es con lo que operamos en el mostrador. Para confirmar disponibilidad de billetes, escríbenos por WhatsApp antes de venir.\n\nNos encuentras en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1, con atención presencial desde 1988 y sin reserva previa. Para montos altos pedimos tu cédula de identidad y registramos la operación según la normativa de la UAF. No somos banco: consultas, comparas y cambias el mismo día, en efectivo y sin abrir cuenta." }} />
    </>
  );
}
