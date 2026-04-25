import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Yuan Chino Chile", item: "https://www.gamaex.cl/cambio-yuan-chino-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Yuan Chino en Chile | CNY/CLP — Gamaex Providencia",
  description:
    "Compra y vende yuanes chinos en Gamaex, Providencia. Precio CNY/CLP actualizado, sin comisiones. Especialistas en divisas asiáticas con 38 años de experiencia.",
  keywords: [
    "cambio yuan chino chile",
    "comprar yuanes santiago",
    "CNY CLP precio hoy",
    "tipo de cambio yuan china chile",
    "yuan chino a peso chileno",
    "renminbi chile",
    "casa de cambio yuan santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-yuan-chino-chile",
  },
  openGraph: {
    title: "Cambio Yuan Chino Chile | CNY/CLP — Gamaex",
    description: "Precio CNY/CLP actualizado. Compra y venta de yuanes en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-yuan-chino-chile",
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

export default async function CambioYuanChinoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio yuan ", h1Accent: "chino en Chile", heroDesc: "Compra y venta de yuan chino (CNY) en Gamaex, Providencia. Cotización CNY/CLP actualizada, sin comisiones." }} />
    </>
  );
}
