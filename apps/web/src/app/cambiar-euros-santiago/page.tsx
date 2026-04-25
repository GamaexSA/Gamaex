import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Euros en Santiago", item: "https://www.gamaex.cl/cambiar-euros-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Euros en Santiago | Gamaex Chile — EUR a CLP Providencia",
  description:
    "Cambia euros a pesos chilenos en Gamaex, Providencia. Mejor precio EUR/CLP, 38 años de trayectoria y atención directa a pasos del Metro Pedro de Valdivia. Sin comisiones ocultas.",
  keywords: [
    "cambiar euros santiago",
    "cambio euro peso chileno",
    "EUR CLP providencia",
    "comprar euros santiago",
    "vender euros santiago",
    "casa de cambio euro santiago",
    "cambio euros providencia",
    "donde cambiar euros en santiago",
    "precio euro hoy santiago chile",
    "cambio euro a pesos chilenos",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-euros-santiago",
  },
  openGraph: {
    title: "Cambiar Euros en Santiago | Gamaex Chile — EUR/CLP",
    description:
      "Compra y venta de euros en Providencia. 38 años de trayectoria. Precios transparentes, sin comisiones.",
    url: "https://www.gamaex.cl/cambiar-euros-santiago",
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

export default async function CambiarEurosSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar euros en ", h1Accent: "Santiago", heroDesc: "Cambia euros en Santiago al mejor precio. Gamaex en Providencia — cotización EUR/CLP actualizada diariamente, sin comisiones." }} />
    </>
  );
}
