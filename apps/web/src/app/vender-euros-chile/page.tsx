import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Vender Euros Chile", item: "https://www.gamaex.cl/vender-euros-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Vender Euros en Chile | Mejor Precio EUR CLP — Gamaex",
  description:
    "Vende tus euros en Chile al mejor precio. Gamaex en Providencia — cotización EUR/CLP actualizada, pago inmediato, sin comisiones. 38 años de trayectoria.",
  keywords: [
    "vender euros chile",
    "donde vender euros chile",
    "precio venta euros chile",
    "EUR CLP venta chile",
    "vender euros santiago chile",
    "mejor precio venta euros chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/vender-euros-chile",
  },
  openGraph: {
    title: "Vender Euros en Chile | Gamaex Providencia",
    description: "Vende euros sin comisiones en Gamaex Chile. EUR/CLP actualizado, pago inmediato.",
    url: "https://www.gamaex.cl/vender-euros-chile",
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

export default async function VenderEurosChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Vender euros en ", h1Accent: "Chile", heroDesc: "Vende tus euros en Chile al mejor precio del día. Gamaex en Providencia — pago inmediato, sin comisiones, cotización EUR/CLP justa.", articleText: "Vender euros en Chile es sencillo en Gamaex Providencia. El local recibe billetes en euros y entrega pesos chilenos al precio del día, sin comisiones ni cargos adicionales. Para montos grandes, se recomienda consultar disponibilidad por WhatsApp antes de ir para asegurar que haya suficiente efectivo en CLP disponible." }} />
    </>
  );
}
