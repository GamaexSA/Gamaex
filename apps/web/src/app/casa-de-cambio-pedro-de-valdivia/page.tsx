import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Pedro de Valdivia", item: "https://www.gamaex.cl/casa-de-cambio-pedro-de-valdivia" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio en Av. Pedro de Valdivia 020",
  description:
    "Gamaex en Av. Pedro de Valdivia 020, Providencia. La casa de cambio de referencia en la avenida Pedro de Valdivia — sin comisiones, +40 divisas, 38 años.",
  keywords: [
    "casa de cambio pedro de valdivia",
    "av pedro de valdivia casa de cambio",
    "cambio divisas av pedro de valdivia",
    "gamaex av pedro de valdivia",
    "casa de cambio pedro valdivia providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-pedro-de-valdivia",
  },
  openGraph: {
    title: "Casa de Cambio Pedro de Valdivia | Gamaex",
    description: "Gamaex en Av. Pedro de Valdivia 020, Providencia. Sin comisiones, 38 años.",
    url: "https://www.gamaex.cl/casa-de-cambio-pedro-de-valdivia",
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

export default async function CasaDeCambioPedrodeValdiviaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio en Av. ", h1Accent: "Pedro de Valdivia", heroDesc: "Gamaex en Av. Pedro de Valdivia 020, Providencia — la casa de cambio de referencia de la avenida. Sin comisiones, +40 divisas, 38 años.", articleHeading: "¿Dónde cambiar dinero en Av. Pedro de Valdivia?", articleText: "Av. Pedro de Valdivia es una de las arterias más reconocibles de Providencia, con su bandejón arbolado, cafés y flujo constante de gente entre Av. Providencia y el sector residencial. Justo aquí, en el número 020, funciona Gamaex, así que si buscas cambiar divisas en Pedro de Valdivia no tienes que ir a ninguna otra parte: estás exactamente en el lugar, con precio del día publicado y sin comisiones.\n\nLlegar es muy simple. La oficina está a pasos del Metro Pedro de Valdivia, en la Línea 1; usando la salida oriente quedas prácticamente en la entrada. Si vienes caminando por Av. Providencia, solo debes ubicar la esquina con Pedro de Valdivia y estás. En auto, es un punto central y fácil de reconocer dentro de Providencia, con conexión directa hacia Los Leones, Manuel Montt y el resto de la Línea 1.\n\nGamaex opera en esta dirección desde 1988 como casa de cambio familiar y de atención presencial. Trabaja más de 40 divisas, muestra el precio del día y no cobra comisiones; la calculadora y la tabla de tasas en vivo están en esta página. Se atiende sin reserva. Para montos altos se pide cédula según la normativa UAF y puedes confirmar la disponibilidad de billetes por WhatsApp. No es banco: resolvemos la operación de inmediato." }} />
    </>
  );
}
