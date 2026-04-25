import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cuánto vale el euro en Chile", item: "https://www.gamaex.cl/cuanto-vale-el-euro-en-chile" },
  ],
});

export const metadata: Metadata = {
  title: "¿Cuánto vale el Euro en Chile hoy? | EUR/CLP — Gamaex",
  description:
    "Precio del euro en Chile hoy. Gamaex publica el valor EUR/CLP de compra y venta diariamente. Calcula cuántos pesos chilenos recibes por tus euros.",
  keywords: [
    "cuanto vale el euro en chile",
    "cuanto esta el euro hoy chile",
    "precio euro chile peso chileno",
    "EUR CLP hoy chile",
    "a cuanto esta el euro en chile hoy",
    "valor euro chile hoy",
    "euro a pesos chilenos hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cuanto-vale-el-euro-en-chile",
  },
  openGraph: {
    title: "¿Cuánto vale el Euro en Chile hoy? | EUR/CLP — Gamaex",
    description: "Precio del euro en Chile hoy. Gamaex Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/cuanto-vale-el-euro-en-chile",
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

export default async function CuantoValeElEuroEnChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "¿Cuánto vale el ", h1Accent: "euro en Chile?", heroDesc: "Cotización del euro en Chile actualizada hoy. Consulta el EUR/CLP en Gamaex y cambia tus euros en Providencia sin comisiones." }} />
    </>
  );
}
