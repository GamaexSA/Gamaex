import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Euros a Pesos Chilenos", item: "https://www.gamaex.cl/cambiar-euros-a-pesos-chilenos" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Euros a Pesos Chilenos | EUR CLP — Gamaex",
  description:
    "Cambia euros a pesos chilenos en Gamaex, Providencia. Cotización EUR/CLP actualizada, sin comisiones, pago inmediato. 38 años de experiencia en cambio de divisas.",
  keywords: [
    "cambiar euros a pesos chilenos",
    "euro a peso chileno",
    "EUR CLP hoy",
    "cuanto vale el euro en pesos chilenos",
    "cambio euro peso chile",
    "convertir euros a pesos chilenos",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-euros-a-pesos-chilenos",
  },
  openGraph: {
    title: "Cambiar Euros a Pesos Chilenos | Gamaex",
    description: "EUR/CLP actualizado. Cambia euros a pesos en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/cambiar-euros-a-pesos-chilenos",
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

export default async function CambiarEurosAPesosChilenosPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar euros a ", h1Accent: "pesos chilenos", heroDesc: "Cotización EUR/CLP actualizada diariamente. Cambia tus euros en Gamaex, Providencia — sin comisiones, pago inmediato, atención directa." }} />
    </>
  );
}
