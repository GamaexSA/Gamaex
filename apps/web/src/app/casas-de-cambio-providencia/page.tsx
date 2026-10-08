import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casas de Cambio Providencia", item: "https://www.gamaex.cl/casas-de-cambio-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Casas de Cambio en Providencia · +40 Divisas",
  description:
    "¿Buscas casas de cambio en Providencia? Gamaex en Av. Pedro de Valdivia 020 es la referencia: sin comisiones, +40 divisas, 38 años de trayectoria.",
  keywords: [
    "casas de cambio providencia",
    "casas de cambio en providencia santiago",
    "mejor casa de cambio providencia",
    "donde cambiar moneda providencia",
    "casas de cambio divisas providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casas-de-cambio-providencia",
  },
  openGraph: {
    title: "Casas de Cambio en Providencia | Gamaex",
    description: "La mejor casa de cambio en Providencia. Gamaex, sin comisiones, 38 años.",
    url: "https://www.gamaex.cl/casas-de-cambio-providencia",
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

export default async function CasasDeCambioProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "La mejor casa de cambio en ", h1Accent: "Providencia", heroDesc: "Gamaex en Av. Pedro de Valdivia 020 — la referencia en casas de cambio en Providencia. Sin comisiones, +40 divisas, 38 años.", articleHeading: "¿Dónde encontrar casas de cambio en Providencia?", articleText: "Providencia es uno de los sectores con mayor concentración de casas de cambio en Santiago, sobre todo en torno a Av. Providencia, Los Leones y Pedro de Valdivia. La oferta es amplia, pero conviene elegir un lugar con trayectoria, precio del día a la vista y atención clara. Entre las alternativas del sector, Gamaex destaca por operar sin comisiones y con tasas publicadas, lo que facilita comparar antes de cambiar.\n\nUbicarse es sencillo porque casi todo el eje está sobre la Línea 1 del Metro. Gamaex queda en Av. Pedro de Valdivia 020, a pasos de la estación Pedro de Valdivia; con la salida oriente llegas casi a la puerta. Si vienes desde Los Leones, Manuel Montt o Tobalaba, son solo unos minutos por metro o caminando por Av. Providencia, que recorre toda la comuna de forma directa.\n\nGamaex atiende desde 1988 como empresa familiar y presencial. Trabaja más de 40 divisas, publica el precio del día y no aplica comisiones; la calculadora y la tabla de tasas en vivo están en esta página para que revises antes de venir. No se necesita reserva. Para montos altos se pide cédula según la normativa UAF y puedes confirmar los billetes por WhatsApp. Al no ser banco, la operación es inmediata." }} />
    </>
  );
}
