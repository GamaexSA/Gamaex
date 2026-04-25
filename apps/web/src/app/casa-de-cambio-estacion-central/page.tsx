import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Estación Central", item: "https://www.gamaex.cl/casa-de-cambio-estacion-central" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Estación Central | Gamaex — Divisas Santiago",
  description:
    "Casa de cambio accesible desde Estación Central. Gamaex en Av. Pedro de Valdivia 020, Providencia — conectado por Metro Línea 1. Sin comisiones, 38 años.",
  keywords: [
    "casa de cambio estacion central",
    "cambio divisas estacion central",
    "comprar dolares estacion central santiago",
    "divisas estacion central",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-estacion-central",
  },
  openGraph: {
    title: "Casa de Cambio Estación Central | Gamaex",
    description: "Cambio de divisas accesible desde Estación Central. Gamaex en Providencia.",
    url: "https://www.gamaex.cl/casa-de-cambio-estacion-central",
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

export default async function CasaDeCambioEstacionCentralPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio — ", h1Accent: "Estación Central", heroDesc: "Gamaex en Av. Pedro de Valdivia 020, Providencia — a 15 minutos de Estación Central en Metro Línea 1. Sin comisiones, +40 divisas, 38 años.", articleText: "Desde Estación Central, Gamaex es accesible en Metro Línea 1 directo hasta la estación Pedro de Valdivia. El local está en Av. Pedro de Valdivia 020, a pasos de la salida del metro. Es una alternativa conveniente para quienes llegan o salen por la Estación Central y necesitan cambiar divisas." }} />
    </>
  );
}
