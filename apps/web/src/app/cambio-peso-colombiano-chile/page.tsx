import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Peso Colombiano Chile", item: "https://www.gamaex.cl/cambio-peso-colombiano-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Peso Colombiano en Chile · COP/CLP",
  description:
    "Cambia pesos colombianos en Chile. Gamaex en Providencia compra y vende COP al mejor precio. Sin comisiones, atención directa, 38 años de experiencia.",
  keywords: [
    "cambio peso colombiano chile",
    "COP CLP hoy",
    "precio peso colombiano chile",
    "comprar pesos colombianos santiago",
    "cambiar peso colombiano a peso chileno",
    "divisas colombianas chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-peso-colombiano-chile",
  },
  openGraph: {
    title: "Cambio Peso Colombiano Chile | Gamaex Providencia",
    description: "COP/CLP actualizado. Compra y venta de pesos colombianos en Gamaex sin comisiones.",
    url: "https://www.gamaex.cl/cambio-peso-colombiano-chile",
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

export default async function CambioPesoColombianoCilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio peso ", h1Accent: "colombiano en Chile", heroDesc: "Compra y venta de pesos colombianos (COP) en Gamaex, Providencia. Cotización COP/CLP actualizada, sin comisiones.", articleHeading: "¿Dónde cambio pesos colombianos en Providencia de forma confiable?", articleText: "El peso colombiano (COP) lo buscan en Chile la comunidad colombiana que envía o recibe dinero de familiares, viajeros que van a Cartagena, Medellín o el Eje Cafetero, y quienes tienen vínculos de trabajo o negocios con Colombia. También lo cambian personas que regresan de un viaje con billetes sobrantes y prefieren convertirlos a pesos chilenos en un lugar formal. Al ser una moneda latinoamericana de circulación acotada en Chile, la disponibilidad de billetes puede variar según el día.\n\nEn Gamaex compras y vendes pesos colombianos al precio del día, publicado con claridad en la tabla de tasas y en la calculadora de la misma página, sin comisiones ni cargos ocultos. Nuestro local está en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin reserva previa. Como el COP no es de las divisas de mayor rotación diaria, lo más práctico es escribirnos por WhatsApp antes de venir para confirmar que haya billetes disponibles en el monto que buscas.\n\nGamaex atiende desde 1988 como empresa familiar y está a pasos del Metro Pedro de Valdivia, en la Línea 1, así que llegar es cómodo desde cualquier comuna. No somos banco: la operación es inmediata y no requiere abrir cuenta. Para montos altos se solicita la cédula de identidad y se registra la operación según la normativa UAF. Consulta el valor actualizado del día y cambia tus pesos colombianos de manera clara, presencial y con la tasa siempre a la vista." }} />
    </>
  );
}
