import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Euros Chile", item: "https://www.gamaex.cl/comprar-euros-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Euros en Chile | Mejor Precio EUR CLP — Gamaex",
  description:
    "Compra euros en Chile al mejor precio. Gamaex en Providencia — cotización EUR/CLP actualizada diariamente, sin comisiones, atención directa. 38 años de experiencia.",
  keywords: [
    "comprar euros chile",
    "donde comprar euros chile",
    "precio euros chile",
    "EUR CLP compra chile",
    "comprar euros santiago chile",
    "mejor precio euros chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-euros-chile",
  },
  openGraph: {
    title: "Comprar Euros en Chile | Gamaex Providencia",
    description: "Compra euros sin comisiones en Gamaex Chile. EUR/CLP actualizado.",
    url: "https://www.gamaex.cl/comprar-euros-chile",
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

export default async function ComprarEurosChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar euros en ", h1Accent: "Chile", heroDesc: "Compra euros en Chile al mejor precio del día. Gamaex en Providencia — EUR/CLP actualizado, sin comisiones, atención directa.", articleText: "Comprar euros en Chile es posible en múltiples lugares, pero Gamaex en Providencia destaca por sus precios competitivos y la ausencia de comisiones. El precio EUR/CLP se publica diariamente y es el precio final de la operación. Para montos superiores a 5.000 EUR, se recomienda consultar disponibilidad por WhatsApp con anticipación." }} />
    </>
  );
}
