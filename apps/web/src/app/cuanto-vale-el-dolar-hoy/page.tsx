import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cuánto Vale el Dólar Hoy", item: "https://www.gamaex.cl/cuanto-vale-el-dolar-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Cuánto Vale el Dólar Hoy · Precio USD Chile",
  description:
    "Consulta cuánto vale el dólar hoy en Chile. Gamaex actualiza el precio a diario. Cambia tus dólares en Providencia sin comisiones.",
  keywords: [
    "cuanto vale el dolar hoy",
    "cuanto vale el dolar hoy chile",
    "precio del dolar hoy chile",
    "valor del dolar hoy en chile",
    "dolar hoy chile precio",
    "tipo de cambio dolar hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-dolar-hoy-chile",
  },
  openGraph: {
    title: "Cuánto Vale el Dólar Hoy en Chile | Gamaex",
    description: "Precio del dólar actualizado hoy en Chile. Cambia USD en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cuanto-vale-el-dolar-hoy",
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

export default async function CuantoValeElDolarHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "¿Cuánto vale el ", h1Accent: "dólar hoy?", heroDesc: "Cotización USD/CLP actualizada diariamente en Gamaex. Consulta el precio del dólar y cambia tus divisas en Providencia sin comisiones.", articleHeading: "¿Cuánto vale el dólar hoy?", articleText: "¿Cuánto vale el dólar hoy? La respuesta exacta está en esta misma página: la tabla de tasas y la calculadora en vivo muestran el precio del día, tanto para comprar como para vender dólares. Así ves de inmediato cuántos pesos chilenos equivalen a tus dólares y a la inversa. En Gamaex cambias a ese valor publicado, sin comisiones, de forma presencial y sin necesidad de reservar ni abrir cuenta.\n\nEl valor del dólar cambia todos los días porque responde a un mercado en movimiento constante. Influyen el precio internacional del cobre, clave para la economía chilena, la fortaleza global del dólar, las tasas de interés y las noticias económicas locales y del exterior. Por eso una cifra publicada hoy puede no servir mañana; lo correcto es mirar el precio del día en la calculadora de esta página, que siempre refleja el valor actualizado.\n\nCuando tengas tu referencia, visítanos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1. Operamos como casa de cambio desde 1988 y atendemos en persona, con más de 40 divisas disponibles. Para montos altos se solicita la cédula de identidad según la normativa UAF, y puedes escribirnos por WhatsApp para confirmar la disponibilidad de billetes. La operación es inmediata y sin trámites bancarios." }} />
    </>
  );
}
