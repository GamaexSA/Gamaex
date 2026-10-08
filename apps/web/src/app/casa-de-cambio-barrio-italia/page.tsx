import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Barrio Italia", item: "https://www.gamaex.cl/casa-de-cambio-barrio-italia" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Barrio Italia",
  description:
    "Casa de cambio cercana a Barrio Italia. Gamaex está en Providencia, a pocos minutos de Barrio Italia. Compra y venta de divisas, 38 años de experiencia.",
  keywords: [
    "casa de cambio barrio italia",
    "cambio de divisas barrio italia",
    "comprar dolares barrio italia",
    "casa de cambio cercana barrio italia",
    "cambio moneda providencia barrio italia",
    "divisas barrio italia santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-barrio-italia",
  },
  openGraph: {
    title: "Casa de cambio cerca de Barrio Italia — Gamaex Providencia",
    description: "Cambio de divisas cercano a Barrio Italia. Gamaex en Providencia, 38 años de experiencia.",
    url: "https://www.gamaex.cl/casa-de-cambio-barrio-italia",
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

export default async function CasaDeCambioBarrioItaliaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · ", h1Accent: "Barrio Italia", heroDesc: "Casa de cambio cercana al Barrio Italia. Gamaex en Av. Pedro de Valdivia 020, Providencia — a minutos de Italia. Sin comisiones, 38 años.", articleHeading: "¿Dónde cambiar dinero cerca de Barrio Italia?", articleText: "Barrio Italia, entre Providencia y Ñuñoa, se llenó de tiendas de diseño, cafés y talleres que atraen a locales y turistas por igual. Quien anda de paseo por Av. Italia o Caupolicán muchas veces necesita cambiar divisas antes o después de recorrer el barrio. Si buscas una casa de cambio cercana, con precio del día publicado y sin comisiones, Gamaex en Providencia queda a un trayecto muy corto.\n\nDesde Barrio Italia tienes varias formas de llegar. La estación de metro más cercana es Santa Isabel, en la Línea 5: viaja hasta Baquedano y combina con la Línea 1 hacia el oriente hasta Pedro de Valdivia. En auto, sube por Av. Salvador o toma Av. Providencia rumbo a la altura de Pedro de Valdivia. Es un recorrido breve dentro del mismo sector centro-oriente de la ciudad.\n\nGamaex atiende desde 1988 en Av. Pedro de Valdivia 020 como empresa familiar y presencial. Trabaja más de 40 divisas, publica el precio del día y no cobra comisiones; la calculadora y la tabla de tasas en vivo están en esta misma página. No hace falta reservar hora. Para montos altos se solicita cédula por normativa UAF y puedes confirmar los billetes por WhatsApp antes de venir. No es banco: la operación se hace al momento." }} />
    </>
  );
}
