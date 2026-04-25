import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Yen Japonés Chile", item: "https://www.gamaex.cl/cambio-yen-japones-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Yen Japonés en Chile | JPY/CLP — Gamaex Providencia",
  description:
    "Compra y vende yenes japoneses en Gamaex, Providencia. Precio JPY/CLP actualizado, sin comisiones. 38 años de experiencia a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "cambio yen japones chile",
    "comprar yenes santiago",
    "vender yenes chile",
    "JPY CLP precio hoy",
    "tipo de cambio yen chile",
    "cotizacion yen japones santiago",
    "casa de cambio yen santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-yen-japones-chile",
  },
  openGraph: {
    title: "Cambio Yen Japonés Chile | JPY/CLP — Gamaex",
    description: "Precio JPY/CLP actualizado. Compra y venta de yenes japoneses en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-yen-japones-chile",
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

export default async function CambioYenJaponesPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio yen ", h1Accent: "japonés en Chile", heroDesc: "Compra y venta de yen japonés (JPY) en Gamaex, Providencia. Cotización JPY/CLP actualizada, sin comisiones." }} />
    </>
  );
}
