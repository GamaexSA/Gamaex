import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio en Providencia", item: "https://www.gamaex.cl/casa-de-cambio-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio en Providencia | Gamaex — Av. Pedro de Valdivia 020",
  description:
    "Gamaex: la casa de cambio de referencia en Providencia con 38 años de trayectoria. Compra y venta de +40 divisas en Av. Pedro de Valdivia 020, a metros del Metro Pedro de Valdivia. Sin comisiones ocultas.",
  keywords: [
    "casa de cambio providencia",
    "casa de cambio pedro de valdivia",
    "cambio moneda providencia",
    "donde cambiar moneda providencia",
    "casa de cambio cerca de mí providencia",
    "cambio divisas providencia santiago",
    "mejor casa de cambio providencia",
    "gamaex chile providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-providencia",
  },
  openGraph: {
    title: "Casa de Cambio en Providencia | Gamaex Chile",
    description:
      "38 años de trayectoria en Providencia. +40 divisas, precios finales, sin comisiones. Av. Pedro de Valdivia 020.",
    url: "https://www.gamaex.cl/casa-de-cambio-providencia",
  },
};

async function getRates(): Promise<PublicRatesResponse> {
  const empty: PublicRatesResponse = {
    rates: [],
    system_status: "stale",
    last_sync_at: "",
    cache_ttl_seconds: 60,
  };
  try {
    const url = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/rates/public`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return res.json() as Promise<PublicRatesResponse>;
  } catch {
    return empty;
  }
}

export default async function CasaDeCambioPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "La mejor casa de cambio en ", h1Accent: "Providencia", heroDesc: "Gamaex en Av. Pedro de Valdivia 020 — referencia en cambio de divisas en Providencia por más de 38 años. Sin comisiones.", articleText: "Gamaex es la casa de cambio de referencia en Providencia desde 1987. Ubicada en Av. Pedro de Valdivia 020, a pasos de la salida del Metro Pedro de Valdivia (Línea 1), opera de lunes a viernes de 9:00 a 17:30 y sábados de 9:00 a 13:00. Con más de 38 años de trayectoria, Gamaex ofrece compra y venta de más de 40 monedas extranjeras al mejor precio, sin comisiones ocultas. El precio que ves es el precio final de la operación." }} />
    </>
  );
}
