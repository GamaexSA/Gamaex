import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Euros Providencia", item: "https://www.gamaex.cl/comprar-euros-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Euros en Providencia | Gamaex — Mejor Precio EUR",
  description:
    "Compra euros en Providencia al mejor precio. Gamaex en Av. Pedro de Valdivia 020 — sin comisiones, cotización EUR/CLP actualizada diariamente. 38 años de experiencia.",
  keywords: [
    "comprar euros providencia",
    "donde comprar euros en providencia",
    "precio euro providencia santiago",
    "cambio euros providencia",
    "EUR pesos chilenos providencia",
    "mejor precio euro providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-euros-providencia",
  },
  openGraph: {
    title: "Comprar Euros en Providencia | Gamaex",
    description: "Compra euros sin comisiones en Gamaex Providencia. Precio EUR actualizado.",
    url: "https://www.gamaex.cl/comprar-euros-providencia",
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

export default async function ComprarEurosProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Compra euros en ", h1Accent: "Providencia", heroDesc: "El mejor precio para comprar euros en Providencia. Gamaex en Av. Pedro de Valdivia 020 — cotización EUR/CLP actualizada, sin comisiones, atención directa." }} />
    </>
  );
}
