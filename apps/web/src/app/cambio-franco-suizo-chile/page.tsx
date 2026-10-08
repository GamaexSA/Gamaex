import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Franco Suizo Chile", item: "https://www.gamaex.cl/cambio-franco-suizo-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Franco Suizo en Chile · CHF/CLP",
  description:
    "Compra y vende francos suizos en Gamaex, Providencia. Precio CHF/CLP actualizado, sin comisiones, a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "cambio franco suizo chile",
    "comprar francos suizos santiago",
    "vender francos suizos chile",
    "CHF CLP precio hoy",
    "tipo de cambio franco suizo chile",
    "cotizacion franco suizo santiago",
    "casa de cambio franco suizo",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-franco-suizo-chile",
  },
  openGraph: {
    title: "Cambio Franco Suizo Chile | CHF/CLP — Gamaex",
    description: "Precio CHF/CLP actualizado. Compra y venta de francos suizos en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-franco-suizo-chile",
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

export default async function CambioFrancoSuizoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio franco ", h1Accent: "suizo en Chile", heroDesc: "Compra y venta de franco suizo (CHF) en Gamaex, Providencia. Cotización CHF/CLP actualizada, sin comisiones, atención directa.", articleHeading: "¿Dónde cambio francos suizos con la tasa a la vista en Providencia?", articleText: "El franco suizo (CHF) lo buscan en Chile quienes viajan a Suiza por turismo de montaña, esquí o los Alpes, además de profesionales que asisten a congresos, ferias y reuniones de negocios en ciudades como Zúrich o Ginebra. También lo requieren estudiantes de intercambio y familias con parientes en el país. Al circular menos que el dólar o el euro, es una moneda que conviene conseguir con anticipación y en un lugar que la maneje con regularidad.\n\nEn Gamaex compras y vendes francos suizos al precio del día, publicado con claridad en la tabla de tasas y en la calculadora de la propia página, sin comisiones ni cargos ocultos. Nuestro local está en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin reserva previa. Como el CHF no es de circulación masiva en el día a día, lo más práctico es escribirnos por WhatsApp antes de venir para confirmar que tengamos billetes disponibles en la denominación y el monto que necesitas.\n\nGamaex atiende desde 1988 y se ubica a pasos del Metro Pedro de Valdivia, en la Línea 1, con acceso cómodo para quien viene de otras comunas. No somos banco: la operación es inmediata y no requiere abrir cuenta ni esperar. Para montos altos se solicita la cédula de identidad y se registra la operación según la normativa UAF. Así cambias tus francos suizos de manera formal, cara a cara y con el valor del día siempre publicado antes de decidir." }} />
    </>
  );
}
