import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Divisas sin Comisión", item: "https://www.gamaex.cl/cambio-divisas-sin-comision" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Divisas sin Comisión | Precio final — Gamaex",
  description:
    "Cambio de divisas sin comisión en Gamaex, Providencia. El precio que ves es el precio final — sin cargos ocultos, sin comisiones de ningún tipo. 38 años de transparencia.",
  keywords: [
    "cambio divisas sin comision chile",
    "casa de cambio sin comisiones santiago",
    "cambio dolares sin comision providencia",
    "divisas sin cargo extra chile",
    "mejor precio divisas sin comisiones",
    "cambio moneda precio final chile",
    "casa de cambio transparente santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-divisas-sin-comision",
  },
  openGraph: {
    title: "Cambio de Divisas sin Comisión | Gamaex Providencia",
    description: "Precio final garantizado. Sin comisiones ocultas. Gamaex, 38 años en Providencia.",
    url: "https://www.gamaex.cl/cambio-divisas-sin-comision",
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

export default async function CambioDivisasSinComisionPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de divisas ", h1Accent: "sin comisión", heroDesc: "Cambia divisas sin comisiones en Gamaex, Providencia. El precio que ves es el precio final — sin cargos ocultos, sin sorpresas." }} />
    </>
  );
}
