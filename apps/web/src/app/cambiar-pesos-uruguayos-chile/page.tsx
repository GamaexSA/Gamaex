import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Pesos Uruguayos Chile", item: "https://www.gamaex.cl/cambiar-pesos-uruguayos-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Pesos Uruguayos en Chile | UYU CLP — Gamaex",
  description:
    "Cambia pesos uruguayos en Chile. Gamaex en Providencia compra y vende UYU al mejor precio. Sin comisiones, consultar disponibilidad por WhatsApp.",
  keywords: [
    "cambiar pesos uruguayos chile",
    "peso uruguayo chile",
    "UYU CLP",
    "comprar pesos uruguayos santiago",
    "cambio moneda uruguaya chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-pesos-uruguayos-chile",
  },
  openGraph: {
    title: "Cambiar Pesos Uruguayos Chile | Gamaex Providencia",
    description: "UYU/CLP en Gamaex Providencia. Consultar disponibilidad por WhatsApp.",
    url: "https://www.gamaex.cl/cambiar-pesos-uruguayos-chile",
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

export default async function CambiarPesosUruguayosChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar pesos uruguayos en ", h1Accent: "Chile", heroDesc: "Cambio de pesos uruguayos (UYU) en Gamaex, Providencia. Consultar precio y disponibilidad por WhatsApp antes de visitar el local.", articleText: "El peso uruguayo (UYU) es una divisa de demanda variable en Chile. Gamaex en Providencia puede comprar y vender UYU sujeto a disponibilidad. Se recomienda consultar por WhatsApp el precio del día y confirmar que hay stock antes de realizar el viaje al local." }} />
    </>
  );
}
