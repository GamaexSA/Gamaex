import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Vender Euros Santiago", item: "https://www.gamaex.cl/vender-euros-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Vender Euros en Santiago | EUR/CLP — Gamaex Providencia",
  description:
    "Vende tus euros en Gamaex, Providencia. Obtenemos el mejor precio EUR/CLP del mercado. Sin comisiones, atención directa, 38 años de experiencia.",
  keywords: [
    "vender euros santiago",
    "vender euros chile",
    "donde vender euros santiago",
    "precio venta euro hoy chile",
    "EUR CLP compra",
    "cambiar euros a pesos santiago",
    "casa de cambio venta euros",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/vender-euros-santiago",
  },
  openGraph: {
    title: "Vender Euros Santiago | EUR/CLP — Gamaex",
    description: "Vende tus euros al mejor precio en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/vender-euros-santiago",
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

export default async function VenderEurosSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Vender euros en ", h1Accent: "Santiago", heroDesc: "Vende tus euros en Santiago al mejor precio. Gamaex en Providencia — pago inmediato, sin comisiones, cotización EUR/CLP justa." }} />
    </>
  );
}
