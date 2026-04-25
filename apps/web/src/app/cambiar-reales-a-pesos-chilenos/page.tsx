import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Reales a Pesos Chilenos", item: "https://www.gamaex.cl/cambiar-reales-a-pesos-chilenos" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Reales a Pesos Chilenos | BRL→CLP — Gamaex",
  description:
    "Cambia reales brasileños a pesos chilenos en Gamaex, Providencia. Precio BRL/CLP actualizado, sin comisiones. 38 años de experiencia en Santiago.",
  keywords: [
    "cambiar reales a pesos chilenos",
    "BRL a CLP",
    "real brasileno a peso chileno",
    "cambio real chileno",
    "precio real brasileno chile hoy",
    "cuantos pesos son un real brasileno",
    "cambiar BRL a CLP santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-reales-a-pesos-chilenos",
  },
  openGraph: {
    title: "Cambiar Reales a Pesos Chilenos | BRL→CLP — Gamaex",
    description: "Cambia reales a pesos chilenos en Gamaex Providencia. Precio justo, sin comisiones.",
    url: "https://www.gamaex.cl/cambiar-reales-a-pesos-chilenos",
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

export default async function CambiarRealesAPesosChilenosPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar reales a ", h1Accent: "pesos chilenos", heroDesc: "Cambia reales brasileños a pesos chilenos en Gamaex, Providencia. Cotización BRL/CLP actualizada, sin comisiones, atención directa." }} />
    </>
  );
}
