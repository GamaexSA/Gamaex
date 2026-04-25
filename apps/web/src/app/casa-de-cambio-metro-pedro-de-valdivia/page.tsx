import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Metro Pedro de Valdivia", item: "https://www.gamaex.cl/casa-de-cambio-metro-pedro-de-valdivia" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Metro Pedro de Valdivia | Gamaex Chile",
  description:
    "Gamaex está a pasos del Metro Pedro de Valdivia (Línea 1). La casa de cambio de referencia en Providencia: 38 años de trayectoria, +40 divisas, precios finales sin comisiones.",
  keywords: [
    "casa de cambio metro pedro de valdivia",
    "cambio moneda pedro de valdivia",
    "casa de cambio linea 1 santiago",
    "cambio divisas metro providencia",
    "casa de cambio a pasos del metro",
    "gamaex metro pedro de valdivia",
    "cambio dolar metro pedro de valdivia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-metro-pedro-de-valdivia",
  },
  openGraph: {
    title: "Casa de Cambio Metro Pedro de Valdivia | Gamaex",
    description:
      "A pasos del Metro Pedro de Valdivia (Línea 1). 38 años de trayectoria, +40 divisas. Gamaex, Providencia.",
    url: "https://www.gamaex.cl/casa-de-cambio-metro-pedro-de-valdivia",
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

export default async function CasaDeCambioMetroPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · Metro ", h1Accent: "Pedro de Valdivia", heroDesc: "A pasos de la salida del Metro Pedro de Valdivia. Gamaex en Av. Pedro de Valdivia 020, Providencia — divisas sin comisiones.", articleText: "El local de Gamaex se encuentra literalmente a pasos de la salida del Metro Pedro de Valdivia en Providencia. Desde la estación, camina menos de un minuto por Av. Pedro de Valdivia hacia el número 020. Es el punto de referencia para cientos de clientes que aprovechan el trayecto en metro para cambiar sus divisas antes o después del trabajo." }} />
    </>
  );
}
