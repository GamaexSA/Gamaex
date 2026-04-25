import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Dólares Sin Comisión", item: "https://www.gamaex.cl/comprar-dolares-sin-comision" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Dólares Sin Comisión en Chile | Gamaex Providencia",
  description:
    "Compra dólares sin comisión en Gamaex, Providencia. Sin cargos ocultos, sin spreads abusivos. El precio que ves es el precio final — 38 años de transparencia.",
  keywords: [
    "comprar dolares sin comision",
    "donde comprar dolares sin comision chile",
    "casa de cambio sin comision santiago",
    "dolares sin comision providencia",
    "cambio dolar sin cargos",
    "mejor precio dolar sin comision",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-dolares-sin-comision",
  },
  openGraph: {
    title: "Comprar Dólares Sin Comisión | Gamaex Chile",
    description: "Sin comisiones, sin cargos ocultos. Compra dólares en Gamaex Providencia al precio real.",
    url: "https://www.gamaex.cl/comprar-dolares-sin-comision",
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

export default async function ComprarDolaresSinComisionPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Dólares sin ", h1Accent: "comisión ni cargos", heroDesc: "En Gamaex operamos con precios finales. Sin comisiones ocultas, sin cargos por operación. El precio que ves es el precio que pagas — 38 años de transparencia.", articleText: "En Gamaex, comprar dólares sin comisión es la norma, no la excepción. A diferencia de bancos y servicios online que aplican spreads abusivos, Gamaex opera con precios finales transparentes. El precio publicado en la pantalla es el precio de la operación. Sin cargos adicionales, sin letra pequeña." }} />
    </>
  );
}
