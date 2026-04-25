import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio en Santiago", item: "https://www.gamaex.cl/casa-de-cambio-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio en Santiago | Gamaex — Providencia, 38 Años",
  description:
    "La mejor casa de cambio en Santiago está en Gamaex, Providencia. 38 años comprando y vendiendo más de 40 divisas. Atención directa, precios finales, sin comisiones. Metro Pedro de Valdivia.",
  keywords: [
    "casa de cambio santiago",
    "casa de cambio santiago chile",
    "casa de cambio en santiago centro",
    "cambio moneda santiago",
    "mejor casa de cambio santiago",
    "casa de cambio confiable santiago",
    "casa de cambio cerca de mí santiago",
    "donde cambiar moneda santiago",
    "casas de cambio santiago precio",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-santiago",
  },
  openGraph: {
    title: "Casa de Cambio en Santiago | Gamaex Chile",
    description:
      "38 años en Providencia. +40 divisas, precios transparentes, sin comisiones ocultas. Metro Pedro de Valdivia.",
    url: "https://www.gamaex.cl/casa-de-cambio-santiago",
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

export default async function CasaDeCambioSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage
        rates={data.rates}
        systemStatus={data.system_status}
        lastSyncAt={data.last_sync_at}
      />
    </>
  );
}
