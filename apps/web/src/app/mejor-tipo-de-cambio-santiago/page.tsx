import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Mejor Tipo de Cambio Santiago", item: "https://www.gamaex.cl/mejor-tipo-de-cambio-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Mejor Tipo de Cambio en Santiago | Sin comisiones — Gamaex",
  description:
    "Gamaex ofrece el mejor tipo de cambio en Santiago: precios finales, sin comisiones ocultas. 38 años de trayectoria en Providencia. Compara y elige.",
  keywords: [
    "mejor tipo de cambio santiago",
    "mejor casa de cambio santiago",
    "mejor precio dolar santiago",
    "cambio sin comisiones santiago",
    "donde cambiar mejor precio santiago",
    "mejores precios divisas santiago",
    "tipo de cambio mas conveniente santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/mejor-tipo-de-cambio-santiago",
  },
  openGraph: {
    title: "Mejor Tipo de Cambio Santiago | Gamaex — Sin comisiones",
    description: "El mejor tipo de cambio en Santiago con precios finales sin comisiones. Gamaex Providencia.",
    url: "https://www.gamaex.cl/mejor-tipo-de-cambio-santiago",
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

export default async function MejorTipoDeCambioSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
