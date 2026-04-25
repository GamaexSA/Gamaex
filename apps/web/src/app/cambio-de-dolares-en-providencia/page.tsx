import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Dólares en Providencia", item: "https://www.gamaex.cl/cambio-de-dolares-en-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Dólares en Providencia | Gamaex — Mejor Precio USD",
  description:
    "Cambia dólares en Providencia al mejor precio. Gamaex en Av. Pedro de Valdivia 020 — cotización USD/CLP actualizada, sin comisiones, atención inmediata.",
  keywords: [
    "cambio de dolares en providencia",
    "cambio dolares providencia",
    "donde cambiar dolares providencia",
    "precio dolar providencia",
    "cambio USD providencia santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-de-dolares-en-providencia",
  },
  openGraph: {
    title: "Cambio de Dólares en Providencia | Gamaex",
    description: "Cambia dólares sin comisiones en Gamaex Providencia. USD/CLP actualizado.",
    url: "https://www.gamaex.cl/cambio-de-dolares-en-providencia",
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

export default async function CambioDeDolaresEnProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de dólares en ", h1Accent: "Providencia", heroDesc: "Cambia dólares en Providencia al mejor precio del día. Gamaex en Av. Pedro de Valdivia 020 — sin comisiones, atención directa, precio transparente.", articleText: "El cambio de dólares en Providencia tiene en Gamaex su mejor opción. El local en Av. Pedro de Valdivia 020 opera desde 1987 con un modelo sin comisiones: el precio publicado en pantalla es el precio de la operación. Se puede comprar y vender USD, sin necesidad de reserva previa para operaciones regulares." }} />
    </>
  );
}
