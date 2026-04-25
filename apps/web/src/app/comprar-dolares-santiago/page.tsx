import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Dólares en Santiago", item: "https://www.gamaex.cl/comprar-dolares-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Dólares en Santiago | Gamaex Chile — Providencia",
  description:
    "¿Dónde comprar dólares en Santiago? Gamaex en Providencia: 38 años de trayectoria, precios transparentes y atención directa a pasos del Metro Pedro de Valdivia. Sin comisiones ocultas.",
  keywords: [
    "comprar dolares santiago",
    "donde comprar dolares en santiago",
    "comprar dolares providencia",
    "comprar USD chile",
    "comprar divisas santiago",
    "mejor precio dolares santiago",
    "comprar dolares sin comision santiago",
    "cambio dolar compra providencia",
    "comprar dolares metro pedro de valdivia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-dolares-santiago",
  },
  openGraph: {
    title: "Comprar Dólares en Santiago | Gamaex Chile — Providencia",
    description:
      "38 años cambiando moneda en Providencia. Precios finales, sin comisiones. Metro Pedro de Valdivia.",
    url: "https://www.gamaex.cl/comprar-dolares-santiago",
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

export default async function ComprarDolaresSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar dólares en ", h1Accent: "Santiago", heroDesc: "El mejor lugar para comprar dólares en Santiago. Gamaex en Providencia — cotización USD/CLP actualizada, sin comisiones." }} />
    </>
  );
}
