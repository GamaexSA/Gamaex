import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio El Bosque", item: "https://www.gamaex.cl/casa-de-cambio-el-bosque" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio El Bosque | Gamaex — Divisas en Providencia",
  description:
    "Casa de cambio cercana a El Bosque, Las Condes. Gamaex en Av. Pedro de Valdivia 020, Providencia. Más de 40 divisas, sin comisiones, 38 años de experiencia.",
  keywords: [
    "casa de cambio el bosque",
    "cambio divisas el bosque santiago",
    "comprar dolares el bosque las condes",
    "casa de cambio cercana el bosque",
    "divisas el bosque santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-el-bosque",
  },
  openGraph: {
    title: "Casa de Cambio El Bosque | Gamaex Providencia",
    description: "Cambio de divisas cercano a El Bosque. Gamaex en Providencia, 38 años.",
    url: "https://www.gamaex.cl/casa-de-cambio-el-bosque",
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

export default async function CasaDeCambioElBosquePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
