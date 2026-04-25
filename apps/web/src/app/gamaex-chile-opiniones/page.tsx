import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Gamaex Chile Opiniones", item: "https://www.gamaex.cl/gamaex-chile-opiniones" },
  ],
});

export const metadata: Metadata = {
  title: "Gamaex Chile Opiniones | Casa de Cambio Confiable en Providencia",
  description:
    "Lee las opiniones de clientes sobre Gamaex en Chile. Casa de cambio con 38 años de trayectoria en Providencia. Precios transparentes, atención directa y sin comisiones.",
  keywords: [
    "gamaex chile opiniones",
    "gamaex providencia opiniones",
    "casa de cambio gamaex",
    "gamaex reseñas",
    "gamaex confiable",
    "gamaex chile",
    "opiniones casa de cambio providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/gamaex-chile-opiniones",
  },
  openGraph: {
    title: "Gamaex Chile Opiniones | Casa de Cambio en Providencia",
    description: "38 años de experiencia en cambio de divisas en Santiago. Conoce lo que dicen nuestros clientes.",
    url: "https://www.gamaex.cl/gamaex-chile-opiniones",
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

export default async function GamaexChileOpinionesPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Opiniones sobre ", h1Accent: "Gamaex Chile", heroDesc: "Clientes reales opinan sobre Gamaex, la casa de cambio de referencia en Providencia. 38 años al servicio de personas y empresas." }} />
    </>
  );
}
