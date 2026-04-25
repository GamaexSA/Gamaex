import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cuánto está el dólar en Chile", item: "https://www.gamaex.cl/cuanto-esta-el-dolar-en-chile" },
  ],
});

export const metadata: Metadata = {
  title: "¿Cuánto está el dólar en Chile hoy? | USD/CLP — Gamaex",
  description:
    "Precio actualizado del dólar en Chile hoy. Gamaex publica los precios de compra y venta USD/CLP diariamente en Providencia. Sin comisiones ocultas.",
  keywords: [
    "cuanto esta el dolar en chile",
    "cuanto vale el dolar hoy chile",
    "precio dolar chile hoy compra venta",
    "a cuanto esta el dolar hoy chile",
    "valor dolar chileno hoy",
    "dolar chileno precio hoy",
    "USD CLP precio actual chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cuanto-esta-el-dolar-en-chile",
  },
  openGraph: {
    title: "¿Cuánto está el dólar en Chile hoy? | USD/CLP — Gamaex",
    description: "Precio del dólar en Chile hoy, actualizado diariamente en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cuanto-esta-el-dolar-en-chile",
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

export default async function CuantoEstaElDolarEnChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
