import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Vitacura", item: "https://www.gamaex.cl/casa-de-cambio-vitacura" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Vitacura · Divisas",
  description:
    "La opción más conveniente para cambiar divisas cerca de Vitacura: Gamaex en Providencia. +40 monedas, 38 años, precios transparentes. Metro Línea 1.",
  keywords: [
    "casa de cambio vitacura",
    "cambio moneda vitacura",
    "cambio divisas vitacura santiago",
    "donde cambiar moneda vitacura",
    "casa de cambio cerca de vitacura",
    "cambio dolar vitacura",
    "mejor casa de cambio vitacura",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-vitacura",
  },
  openGraph: {
    title: "Casa de cambio cerca de Vitacura — Gamaex Providencia",
    description:
      "La casa de cambio más cercana a Vitacura — Gamaex en Providencia. +40 divisas, 38 años.",
    url: "https://www.gamaex.cl/casa-de-cambio-vitacura",
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

export default async function CasaDeCambioVitacuraPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio cercana a ", h1Accent: "Vitacura", heroDesc: "Casa de cambio cerca de Vitacura. Gamaex en Av. Pedro de Valdivia 020, Providencia — divisas sin comisiones, 38 años de trayectoria.", articleHeading: "¿Dónde cambiar dinero cerca de Vitacura?", articleText: "Vitacura es una comuna residencial y comercial del sector oriente, con Av. Vitacura, Nueva Costanera y Bicentenario como ejes principales. Al no tener estaciones de metro propias, sus vecinos suelen buscar una casa de cambio bien ubicada y fácil de alcanzar en auto o transporte. Gamaex, en Providencia, es una opción cercana y con trayectoria, que publica su precio del día y opera sin comisiones.\n\nDesde Vitacura el trayecto es corto en auto. Puedes bajar por Av. Vitacura o tomar Américo Vespucio hacia Providencia y seguir hasta la altura de Pedro de Valdivia, en el número 020. Si prefieres el metro, acércate a una estación de la Línea 1 como Tobalaba y viaja al poniente un par de estaciones hasta Pedro de Valdivia. La salida oriente del metro te deja a pasos de la oficina.\n\nGamaex funciona desde 1988 como casa de cambio familiar y de atención presencial. Maneja más de 40 divisas, muestra el precio del día y no cobra comisiones; en esta página tienes calculadora y tabla de tasas en vivo. No requiere reserva. Para montos altos se solicita cédula por la normativa UAF y puedes escribir por WhatsApp para confirmar los billetes que necesitas antes de venir. No es banco: la operación se resuelve al momento." }} />
    </>
  );
}
