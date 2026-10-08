import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Corona Noruega Chile", item: "https://www.gamaex.cl/cambio-corona-noruega-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Corona Noruega en Chile · NOK/CLP",
  description:
    "Compra y vende coronas noruegas en Gamaex, Providencia. Precio NOK/CLP actualizado, sin comisiones, a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "cambio corona noruega chile",
    "comprar coronas noruegas santiago",
    "NOK CLP precio hoy",
    "tipo de cambio corona noruega chile",
    "corona noruega a peso chileno",
    "casa de cambio corona noruega",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-corona-noruega-chile",
  },
  openGraph: {
    title: "Cambio Corona Noruega Chile | NOK/CLP — Gamaex",
    description: "Precio NOK/CLP actualizado. Compra y venta en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-corona-noruega-chile",
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

export default async function CambioCoronaNoruegaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio corona ", h1Accent: "noruega en Chile", heroDesc: "Compra y venta de corona noruega (NOK) en Gamaex, Providencia. Cotización NOK/CLP actualizada, sin comisiones.", articleHeading: "¿Dónde cambio coronas noruegas en Santiago sin tanta vuelta?", articleText: "La corona noruega (NOK) no es una moneda que se encuentre en cualquier parte de Chile. La suelen buscar quienes preparan un viaje a Noruega para ver los fiordos, la aurora boreal o los cruceros del norte, además de estudiantes y profesionales que se van por temporadas de trabajo. También la traen de vuelta viajeros que regresaron con billetes sobrantes y prefieren convertirlos a pesos en un lugar formal. Al ser una divisa menos común, la disponibilidad de billetes varía según el día.\n\nPor lo mismo, conviene manejarla en un local físico con precio publicado y no dejarlo al azar. En Gamaex, en Av. Pedro de Valdivia 020, Providencia, la corona noruega se compra y se vende al precio del día, visible en la tabla de tasas y la calculadora de la misma página, sin comisiones ni cargos ocultos. Como es una moneda de baja rotación, lo más práctico es escribir por WhatsApp antes de ir para confirmar que haya billetes disponibles en el monto que necesitas.\n\nGamaex atiende de forma presencial desde 1988 y está a pasos del Metro Pedro de Valdivia, en la Línea 1, así que llegar es simple aunque no vivas en el sector. No es un banco: la operación es inmediata y no necesitas abrir cuenta ni reservar hora. Para montos altos se solicita la cédula de identidad y se registra la operación según la normativa UAF. Así resuelves tus coronas con claridad, cara a cara y con la tasa a la vista." }} />
    </>
  );
}
