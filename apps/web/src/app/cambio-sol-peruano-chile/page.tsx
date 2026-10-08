import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Sol Peruano Chile", item: "https://www.gamaex.cl/cambio-sol-peruano-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Sol Peruano en Chile · PEN/CLP Hoy",
  description:
    "Cambia soles peruanos en Chile. Gamaex en Providencia compra y vende PEN al mejor precio, sin comisiones. 38 años de experiencia en divisas.",
  keywords: [
    "cambio sol peruano chile",
    "PEN CLP hoy",
    "precio sol peruano chile",
    "comprar soles peruanos santiago",
    "cambiar sol peruano a peso chileno",
    "divisas peruanas chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-sol-peruano-chile",
  },
  openGraph: {
    title: "Cambio Sol Peruano Chile | Gamaex Providencia",
    description: "PEN/CLP actualizado. Compra y venta de soles peruanos en Gamaex sin comisiones.",
    url: "https://www.gamaex.cl/cambio-sol-peruano-chile",
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

export default async function CambioSolPeruanoChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio sol ", h1Accent: "peruano en Chile", heroDesc: "Compra y venta de soles peruanos (PEN) en Gamaex, Providencia. Cotización PEN/CLP actualizada, sin comisiones.", articleHeading: "¿Dónde cambio soles peruanos en Providencia de manera formal?", articleText: "El sol peruano (PEN) lo buscan en Chile la numerosa comunidad peruana que viaja o envía apoyo a su familia, turistas que van a Cusco, Machu Picchu, Lima o la gastronomía del norte, y quienes tienen negocios entre ambos países. También lo cambian viajeros que regresan con billetes y prefieren convertirlos a pesos chilenos en un lugar formal. Por la cercanía y el flujo constante de personas entre Chile y Perú, es una de las monedas latinoamericanas más consultadas.\n\nEn Gamaex compras y vendes soles peruanos al precio del día, siempre visible en la tabla de tasas y en la calculadora del propio sitio, sin comisiones ni cargos escondidos. Estamos en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin necesidad de reservar hora. Si vas a cambiar un monto alto o necesitas denominaciones específicas, te recomendamos confirmar disponibilidad de billetes por WhatsApp antes de acercarte, para que la operación sea rápida cuando llegues.\n\nGamaex opera desde 1988 como casa de cambio familiar y se ubica a pasos del Metro Pedro de Valdivia, en la Línea 1, con acceso simple desde toda la ciudad. No somos banco: cambias en el momento, sin abrir cuenta ni esperas. Para montos altos se pide la cédula de identidad y se registra la operación conforme a la normativa UAF. Consulta el valor actualizado del día y resuelve tu cambio de soles peruanos con la tasa a la vista, cara a cara y sin sorpresas." }} />
    </>
  );
}
