import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Yenes Japoneses Chile", item: "https://www.gamaex.cl/comprar-yenes-japoneses-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Yenes Japoneses en Chile | JPY CLP — Gamaex",
  description:
    "Compra yenes japoneses en Chile para tu viaje a Japón. Gamaex en Providencia — cotización JPY/CLP actualizada, sin comisiones, atención directa. 38 años de experiencia.",
  keywords: [
    "comprar yenes japoneses chile",
    "donde comprar yenes en chile",
    "precio yen japones chile",
    "JPY CLP hoy",
    "comprar yenes santiago",
    "yenes japoneses providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-yenes-japoneses-chile",
  },
  openGraph: {
    title: "Comprar Yenes Japoneses Chile | Gamaex Providencia",
    description: "JPY/CLP actualizado. Compra yenes japoneses en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/comprar-yenes-japoneses-chile",
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

export default async function ComprarYenesJaponesesChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar yenes japoneses en ", h1Accent: "Chile", heroDesc: "Compra yenes japoneses (JPY) para tu viaje a Japón. Gamaex en Providencia — cotización JPY/CLP actualizada, sin comisiones." }} />
    </>
  );
}
