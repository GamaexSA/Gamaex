import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Ñuñoa", item: "https://www.gamaex.cl/casa-de-cambio-nunoa" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Cerca de Ñuñoa | Gamaex — Providencia, Santiago",
  description:
    "Cambia divisas cerca de Ñuñoa en Gamaex, Providencia. 38 años de experiencia, más de 40 monedas, precios finales sin comisiones. Acceso fácil por Metro Línea 1.",
  keywords: [
    "casa de cambio ñuñoa",
    "cambio moneda ñuñoa",
    "cambio divisas ñuñoa santiago",
    "donde cambiar moneda ñuñoa",
    "casa de cambio cerca de ñuñoa",
    "cambio dolar ñuñoa",
    "cambio euro ñuñoa",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-nunoa",
  },
  openGraph: {
    title: "Casa de Cambio Cerca de Ñuñoa | Gamaex Chile",
    description:
      "Casa de cambio en Providencia, cerca de Ñuñoa. +40 divisas, sin comisiones, 38 años de trayectoria.",
    url: "https://www.gamaex.cl/casa-de-cambio-nunoa",
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

export default async function CasaDeCambioNunoaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
