import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Mejor Tipo de Cambio Santiago", item: "https://www.gamaex.cl/mejor-tipo-de-cambio-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Mejor Tipo de Cambio Santiago · Sin Comisión",
  description:
    "Gamaex ofrece el mejor tipo de cambio en Santiago: precios finales, sin comisiones ocultas. 38 años de trayectoria en Providencia. Compara y elige.",
  keywords: [
    "mejor tipo de cambio santiago",
    "mejor casa de cambio santiago",
    "mejor precio dolar santiago",
    "cambio sin comisiones santiago",
    "donde cambiar mejor precio santiago",
    "mejores precios divisas santiago",
    "tipo de cambio mas conveniente santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/mejor-tipo-de-cambio-santiago",
  },
  openGraph: {
    title: "Mejor Tipo de Cambio Santiago | Gamaex — Sin comisiones",
    description: "El mejor tipo de cambio en Santiago con precios finales sin comisiones. Gamaex Providencia.",
    url: "https://www.gamaex.cl/mejor-tipo-de-cambio-santiago",
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

export default async function MejorTipoDeCambioSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "El mejor tipo de ", h1Accent: "cambio en Santiago", heroDesc: "Gamaex ofrece el mejor tipo de cambio en Santiago. Sin comisiones, precios actualizados y 38 años de trayectoria en Providencia.", articleHeading: "¿Cómo saber cuál es el mejor tipo de cambio en Santiago?", articleText: "El mejor tipo de cambio no es solo el número más conveniente en una vitrina: es el precio real que recibes después de comisiones y cargos. En Gamaex publicamos el precio de compra y de venta del día y operamos sin comisiones, así que lo que ves es lo que obtienes.\n\nPara comparar de verdad conviene fijarse en tres cosas: el precio publicado, si hay o no comisión, y la rapidez de la atención. Llevamos 38 años en Providencia con local físico verificable y reseñas en Google, lo que da respaldo a la operación.\n\nRevisa el precio del día en la calculadora de esta página y, para montos altos, confirma el valor por WhatsApp antes de venir a Av. Pedro de Valdivia 020." }} />
    </>
  );
}
