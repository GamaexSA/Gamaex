import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Dólares a Pesos Chilenos", item: "https://www.gamaex.cl/cambiar-dolares-a-pesos-chilenos" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Dólares a Pesos Chilenos | USD→CLP — Gamaex",
  description:
    "Cambia dólares a pesos chilenos en Gamaex, Providencia. Precio USD/CLP justo, sin comisiones ocultas. Calcula cuántos pesos recibes por tus dólares.",
  keywords: [
    "cambiar dolares a pesos chilenos",
    "convertir dolares a pesos chilenos",
    "USD a CLP",
    "dolares a pesos chilenos santiago",
    "cuantos pesos son un dolar chile",
    "tipo cambio dolar peso chileno hoy",
    "cambiar USD a CLP santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-dolares-a-pesos-chilenos",
  },
  openGraph: {
    title: "Cambiar Dólares a Pesos Chilenos | USD→CLP — Gamaex",
    description: "Cambia dólares a pesos chilenos en Gamaex Providencia. Precio justo, sin comisiones.",
    url: "https://www.gamaex.cl/cambiar-dolares-a-pesos-chilenos",
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

export default async function CambiarDolaresAPesosChilenosPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar dólares a ", h1Accent: "pesos chilenos", heroDesc: "Cambia tus dólares a pesos chilenos al mejor precio. Gamaex en Providencia — cotización USD/CLP actualizada, sin comisiones, pago inmediato." }} />
    </>
  );
}
