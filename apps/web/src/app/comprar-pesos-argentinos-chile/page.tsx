import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Pesos Argentinos Chile", item: "https://www.gamaex.cl/comprar-pesos-argentinos-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Pesos Argentinos en Chile | ARS CLP — Gamaex",
  description:
    "Compra pesos argentinos en Chile para tu viaje a Argentina. Gamaex en Providencia — cotización ARS/CLP actualizada, sin comisiones, atención directa.",
  keywords: [
    "comprar pesos argentinos chile",
    "donde comprar pesos argentinos santiago",
    "precio peso argentino chile",
    "ARS CLP hoy",
    "comprar ARS santiago",
    "pesos argentinos providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-pesos-argentinos-chile",
  },
  openGraph: {
    title: "Comprar Pesos Argentinos Chile | Gamaex Providencia",
    description: "ARS/CLP actualizado. Compra pesos argentinos en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/comprar-pesos-argentinos-chile",
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

export default async function ComprarPesosArgentinosChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar pesos argentinos en ", h1Accent: "Chile", heroDesc: "Compra pesos argentinos (ARS) para tu viaje a Argentina. Gamaex en Providencia — cotización ARS/CLP actualizada, sin comisiones, atención directa.", articleText: "El peso argentino (ARS) es una de las divisas más consultadas en Chile dado el flujo turístico y comercial entre ambos países. Gamaex en Providencia ofrece compra y venta de pesos argentinos con cotización actualizada. Por la volatilidad del ARS, se recomienda consultar el precio por WhatsApp antes de ir para confirmar disponibilidad y cotización del día." }} />
    </>
  );
}
