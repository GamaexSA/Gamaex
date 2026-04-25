import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Euros en Providencia", item: "https://www.gamaex.cl/cambio-de-euros-en-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Euros en Providencia | Gamaex — Mejor Precio EUR",
  description:
    "Cambia euros en Providencia al mejor precio. Gamaex en Av. Pedro de Valdivia 020 — cotización EUR/CLP actualizada, sin comisiones, atención inmediata.",
  keywords: [
    "cambio de euros en providencia",
    "cambio euros providencia",
    "donde cambiar euros providencia",
    "precio euro providencia",
    "cambio EUR providencia santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-de-euros-en-providencia",
  },
  openGraph: {
    title: "Cambio de Euros en Providencia | Gamaex",
    description: "Cambia euros sin comisiones en Gamaex Providencia. EUR/CLP actualizado.",
    url: "https://www.gamaex.cl/cambio-de-euros-en-providencia",
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

export default async function CambioDeEurosEnProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de euros en ", h1Accent: "Providencia", heroDesc: "Cambia euros en Providencia al mejor precio del día. Gamaex en Av. Pedro de Valdivia 020 — sin comisiones, atención directa, cotización EUR/CLP transparente.", articleText: "El cambio de euros en Providencia encuentra en Gamaex la mejor relación precio-conveniencia. El local en Av. Pedro de Valdivia 020 actualiza el EUR/CLP todos los días hábiles. Se puede comprar y vender EUR sin comisiones, con atención directa y sin necesidad de reserva para montos normales." }} />
    </>
  );
}
