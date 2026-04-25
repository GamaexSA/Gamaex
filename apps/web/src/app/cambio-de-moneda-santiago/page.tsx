import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Moneda en Santiago", item: "https://www.gamaex.cl/cambio-de-moneda-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Moneda en Santiago | Gamaex Chile — Providencia",
  description:
    "Cambia tu moneda en Santiago con Gamaex: 38 años de trayectoria en Providencia. +40 divisas, precios finales sin comisiones. A pasos del Metro Pedro de Valdivia. Cotizá por WhatsApp antes de venir.",
  keywords: [
    "cambio de moneda santiago",
    "casa de cambio santiago",
    "cambio moneda santiago centro",
    "donde cambiar moneda en santiago",
    "cambio divisas santiago chile",
    "mejor casa de cambio santiago",
    "cambio moneda providencia santiago",
    "exchange de moneda santiago",
    "cambiar pesos chilenos a dolares santiago",
    "gamaex santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-de-moneda-santiago",
  },
  openGraph: {
    title: "Cambio de Moneda en Santiago | Gamaex Chile",
    description:
      "38 años de trayectoria. +40 divisas, sin comisiones. Av. Pedro de Valdivia 020, Providencia.",
    url: "https://www.gamaex.cl/cambio-de-moneda-santiago",
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

export default async function CambioMonedaSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de moneda en ", h1Accent: "Santiago", heroDesc: "Cambio de moneda en Santiago con más de 40 divisas. Gamaex en Providencia — precios del día, sin comisiones, 38 años de trayectoria." }} />
    </>
  );
}
