import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Reales en Santiago", item: "https://www.gamaex.cl/cambiar-reales-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Reales Brasileños en Santiago | Gamaex Chile — BRL/CLP",
  description:
    "Cambia reales brasileños (BRL) en Gamaex Providencia. Precio competitivo BRL/CLP, 38 años de experiencia, atención directa a pasos del Metro Pedro de Valdivia. Cotizá por WhatsApp.",
  keywords: [
    "cambiar reales santiago",
    "cambio real brasileño santiago",
    "BRL CLP providencia",
    "cambio real a peso chileno",
    "comprar reales brasileños chile",
    "vender reales brasileños santiago",
    "casa de cambio real brasileño santiago",
    "tipo de cambio real brasileño chile hoy",
    "cambiar reales providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-reales-santiago",
  },
  openGraph: {
    title: "Cambiar Reales Brasileños en Santiago | Gamaex — BRL/CLP",
    description:
      "Compra y venta de reales brasileños en Providencia. Precio BRL/CLP competitivo. 38 años de trayectoria.",
    url: "https://www.gamaex.cl/cambiar-reales-santiago",
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

export default async function CambiarRealesSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar reales en ", h1Accent: "Santiago", heroDesc: "Cambia reales brasileños en Santiago al mejor precio. Gamaex en Providencia — cotización BRL/CLP diaria, sin comisiones." }} />
    </>
  );
}
