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
  title: "Comprar Dólares Sin Comisión · Precio Final",
  description:
    "Compra dólares sin comisión en Gamaex, Providencia. Sin cargos ocultos: el precio que ves es el precio final. 38 años de transparencia.",
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
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Dólares sin ", h1Accent: "comisión ni cargos", heroDesc: "En Gamaex operamos con precios finales. Sin comisiones ocultas, sin cargos por operación. El precio que ves es el precio que pagas — 38 años de transparencia.", articleHeading: "¿Qué significa comprar dólares sin comisión?", articleText: "En Gamaex el precio que ves es el precio que pagas: no cobramos comisión ni cargos por operación. Muchas casas de cambio y bancos publican un tipo de cambio atractivo y luego suman una comisión o un cargo fijo; nosotros trabajamos con precio final y transparente.\n\nLa única diferencia en cualquier operación es el spread —la brecha natural entre el precio de compra y el de venta del día—, que en una casa de cambio suele ser más acotado que en un banco. Eso, sin comisiones encima, es lo que hace conveniente cambiar acá.\n\nEl precio de compra y de venta del dólar se actualiza a diario y lo ves en la calculadora de esta página. Para montos altos, confirma el valor por WhatsApp antes de venir a Av. Pedro de Valdivia 020, Providencia." }} />
    </>
  );
}
