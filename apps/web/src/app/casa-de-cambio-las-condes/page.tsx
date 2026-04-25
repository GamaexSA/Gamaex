import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Las Condes", item: "https://www.gamaex.cl/casa-de-cambio-las-condes" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Cerca de Las Condes | Gamaex Chile — Providencia",
  description:
    "Gamaex en Providencia: la casa de cambio más cercana a Las Condes. +40 divisas, 38 años de trayectoria, precios finales sin comisiones. A minutos en Metro Línea 1.",
  keywords: [
    "casa de cambio las condes",
    "casa de cambio cerca de las condes",
    "cambio moneda las condes",
    "donde cambiar moneda las condes",
    "casa de cambio providencia las condes",
    "cambio divisas las condes santiago",
    "mejor casa de cambio las condes",
    "cambio dolar las condes",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-las-condes",
  },
  openGraph: {
    title: "Casa de Cambio Cerca de Las Condes | Gamaex — Providencia",
    description:
      "La casa de cambio más cercana a Las Condes está en Gamaex, Providencia. +40 divisas, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-las-condes",
  },
};

async function getRates(): Promise<PublicRatesResponse> {
  const empty: PublicRatesResponse = {
    rates: [],
    system_status: "stale",
    last_sync_at: "",
    cache_ttl_seconds: 60,
  };
  try {
    const url = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/rates/public`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return res.json() as Promise<PublicRatesResponse>;
  } catch {
    return empty;
  }
}

export default async function CasaDeCambioLasCondesPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · ", h1Accent: "Las Condes", heroDesc: "Casa de cambio cercana a Las Condes. Gamaex en Av. Pedro de Valdivia 020, Providencia — USD, EUR y +40 divisas sin comisiones.", articleText: "Aunque Gamaex se ubica en Providencia, es la casa de cambio más accesible para residentes y trabajadores de Las Condes. Su local en Av. Pedro de Valdivia 020 está en el límite entre ambas comunas y es fácilmente accesible en metro (estación Pedro de Valdivia) o en vehículo particular. Sin comisiones y con más de 40 monedas disponibles." }} />
    </>
  );
}
