import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Vender Dólares Providencia", item: "https://www.gamaex.cl/vender-dolares-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Vender Dólares en Providencia | Gamaex — Mejor Precio USD",
  description:
    "Vende tus dólares en Providencia al mejor precio. Gamaex en Av. Pedro de Valdivia 020 — sin comisiones, pago inmediato, tipo de cambio justo. 38 años en el mercado.",
  keywords: [
    "vender dolares providencia",
    "donde vender dolares en providencia",
    "precio dolar providencia santiago",
    "cambiar dolares a pesos providencia",
    "USD a CLP providencia",
    "mejor precio venta dolar providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/vender-dolares-providencia",
  },
  openGraph: {
    title: "Vender Dólares en Providencia | Gamaex",
    description: "Vende dólares sin comisiones en Gamaex Providencia. Pago inmediato.",
    url: "https://www.gamaex.cl/vender-dolares-providencia",
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

export default async function VenderDolaresProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
