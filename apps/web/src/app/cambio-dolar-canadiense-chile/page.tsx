import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Dólar Canadiense Chile", item: "https://www.gamaex.cl/cambio-dolar-canadiense-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Dólar Canadiense en Chile | CAD/CLP — Gamaex Providencia",
  description:
    "Compra y vende dólares canadienses en Gamaex, Providencia. Precio CAD/CLP actualizado, 38 años de trayectoria, atención directa sin comisiones.",
  keywords: [
    "cambio dolar canadiense chile",
    "comprar dolares canadienses santiago",
    "vender dolares canadienses chile",
    "CAD CLP precio hoy",
    "tipo de cambio dolar canadiense chile",
    "cotizacion dolar canadiense santiago",
    "casa de cambio dolar canadiense",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-canadiense-chile",
  },
  openGraph: {
    title: "Cambio Dólar Canadiense Chile | CAD/CLP — Gamaex",
    description: "Precio CAD/CLP actualizado. Compra y venta de dólares canadienses en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-dolar-canadiense-chile",
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

export default async function CambioDolarCanadiensePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio dólar ", h1Accent: "canadiense en Chile", heroDesc: "Compra y venta de dólar canadiense (CAD) en Gamaex, Providencia. Cotización CAD/CLP actualizada, sin comisiones, atención directa." }} />
    </>
  );
}
