import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Peso Argentino Chile", item: "https://www.gamaex.cl/cambio-peso-argentino-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Peso Argentino en Chile | ARS/CLP — Gamaex Providencia",
  description:
    "Compra y vende pesos argentinos en Gamaex, Providencia. Precio ARS/CLP actualizado al día. 38 años de experiencia. Sin comisiones ocultas.",
  keywords: [
    "cambio peso argentino chile",
    "comprar pesos argentinos santiago",
    "vender pesos argentinos chile",
    "ARS CLP precio hoy",
    "tipo de cambio peso argentino chile",
    "cotizacion peso argentino santiago",
    "casa de cambio pesos argentinos",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-peso-argentino-chile",
  },
  openGraph: {
    title: "Cambio Peso Argentino Chile | ARS/CLP — Gamaex",
    description: "Precio ARS/CLP actualizado. Compra y venta de pesos argentinos en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-peso-argentino-chile",
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

export default async function CambioPesoArgentinoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio peso ", h1Accent: "argentino en Chile", heroDesc: "Compra y venta de pesos argentinos (ARS) en Gamaex, Providencia. Cotización ARS/CLP actualizada, sin comisiones." }} />
    </>
  );
}
