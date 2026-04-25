import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Recoleta", item: "https://www.gamaex.cl/casa-de-cambio-recoleta" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Recoleta | Gamaex — Divisas en Providencia",
  description:
    "Casa de cambio cercana a Recoleta. Gamaex en Av. Pedro de Valdivia 020, Providencia — accesible desde Recoleta en Metro (Línea 1). Sin comisiones, 38 años.",
  keywords: [
    "casa de cambio recoleta",
    "cambio divisas recoleta santiago",
    "comprar dolares recoleta",
    "casa de cambio cerca recoleta",
    "divisas recoleta santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-recoleta",
  },
  openGraph: {
    title: "Casa de Cambio Recoleta | Gamaex Providencia",
    description: "Cambio de divisas accesible desde Recoleta. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-recoleta",
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

export default async function CasaDeCambioRecoletaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio cercana a ", h1Accent: "Recoleta", heroDesc: "Gamaex en Av. Pedro de Valdivia 020, Providencia — accesible desde Recoleta en Metro Línea 1. Sin comisiones, +40 divisas, 38 años de trayectoria.", articleText: "Desde Recoleta, Gamaex es fácilmente accesible en Metro Línea 1. Toma el metro hasta la estación Pedro de Valdivia o Baquedano y camina por Av. Pedro de Valdivia hasta el número 020. El viaje desde Recoleta toma menos de 15 minutos en metro." }} />
    </>
  );
}
