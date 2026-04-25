import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Euros Santiago", item: "https://www.gamaex.cl/comprar-euros-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Euros en Santiago | EUR/CLP — Gamaex Providencia",
  description:
    "Compra euros en Gamaex, Providencia. Precio EUR/CLP competitivo, sin comisiones ocultas. 38 años de experiencia a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "comprar euros santiago",
    "comprar euros chile",
    "donde comprar euros santiago",
    "precio euro hoy santiago",
    "EUR CLP venta",
    "cambiar pesos a euros santiago",
    "casa de cambio comprar euros",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-euros-santiago",
  },
  openGraph: {
    title: "Comprar Euros Santiago | EUR/CLP — Gamaex",
    description: "Compra euros al mejor precio en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/comprar-euros-santiago",
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

export default async function ComprarEurosSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar euros en ", h1Accent: "Santiago", heroDesc: "Compra euros en Santiago al mejor precio. Gamaex en Providencia — cotización EUR/CLP actualizada, sin comisiones." }} />
    </>
  );
}
