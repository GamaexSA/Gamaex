import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Vender Euros Providencia", item: "https://www.gamaex.cl/vender-euros-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Vender Euros en Providencia | Gamaex — Mejor Precio EUR",
  description:
    "Vende tus euros en Providencia al mejor precio. Gamaex en Av. Pedro de Valdivia 020 — sin comisiones, pago inmediato, cotización justa EUR/CLP. 38 años en el mercado.",
  keywords: [
    "vender euros providencia",
    "donde vender euros en providencia",
    "precio euro venta providencia",
    "cambiar euros a pesos providencia",
    "EUR a CLP providencia",
    "mejor precio venta euro providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/vender-euros-providencia",
  },
  openGraph: {
    title: "Vender Euros en Providencia | Gamaex",
    description: "Vende euros sin comisiones en Gamaex Providencia. Pago inmediato.",
    url: "https://www.gamaex.cl/vender-euros-providencia",
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

export default async function VenderEurosProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Vende tus euros en ", h1Accent: "Providencia", heroDesc: "El mejor precio para vender euros en Providencia. Gamaex en Av. Pedro de Valdivia 020 — pago inmediato, sin comisiones, cotización justa EUR/CLP." }} />
    </>
  );
}
