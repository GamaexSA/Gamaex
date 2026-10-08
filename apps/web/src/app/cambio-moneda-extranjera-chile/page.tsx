import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Moneda Extranjera Chile", item: "https://www.gamaex.cl/cambio-moneda-extranjera-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Moneda Extranjera Chile · +40 Divisas",
  description:
    "Cambia moneda extranjera en Chile con Gamaex: dólares, euros, reales, yenes y +40 divisas. Precios transparentes, sin comisiones, 38 años de experiencia.",
  keywords: [
    "cambio moneda extranjera chile",
    "donde cambiar moneda extranjera en chile",
    "casa de cambio moneda extranjera santiago",
    "cambiar divisas chile",
    "moneda extranjera providencia",
    "mejor cambio de moneda extranjera chile",
    "casa de cambio divisas chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-moneda-extranjera-chile",
  },
  openGraph: {
    title: "Cambio Moneda Extranjera Chile | +40 divisas — Gamaex",
    description: "Más de 40 divisas en Gamaex Providencia. Precios transparentes, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-moneda-extranjera-chile",
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

export default async function CambioMonedaExtranjeraChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de moneda ", h1Accent: "extranjera en Chile", heroDesc: "Más de 40 monedas extranjeras en Gamaex, Providencia. USD, EUR, GBP, BRL, JPY y más — sin comisiones, 38 años de experiencia.", articleHeading: "¿Dónde cambio moneda extranjera en Santiago con más de 40 divisas?", articleText: "Cambiar moneda extranjera en Chile es una necesidad transversal: viajeros que preparan sus vacaciones, personas que vuelven con billetes sobrantes, familias que apoyan a parientes en el exterior e importadores o profesionales que se mueven entre países. La ventaja de una casa de cambio con amplia variedad es resolver en un solo lugar tanto las divisas más comunes, como dólar y euro, como monedas menos habituales que no siempre están a mano en el comercio. En Gamaex trabajamos con más de 40 divisas.\n\nCompramos y vendemos moneda extranjera al precio del día, publicado con transparencia en la tabla de tasas y en la calculadora del propio sitio, sin comisiones ni cargos ocultos. Nuestro local está en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin reserva previa. Para las divisas más comunes solemos tener stock, pero con las monedas menos habituales lo más práctico es escribirnos por WhatsApp antes de venir, así confirmamos disponibilidad de billetes en el monto que necesitas y evitas viajes en vano.\n\nGamaex atiende desde 1988 como empresa familiar y está a pasos del Metro Pedro de Valdivia, en la Línea 1, con llegada simple desde cualquier comuna. No somos banco: la operación es inmediata y no requiere abrir cuenta. Para montos altos se solicita la cédula de identidad y se registra la operación según la normativa UAF. Consulta el valor actualizado del día y cambia tus divisas de forma clara, presencial y con la tasa siempre a la vista antes de decidir." }} />
    </>
  );
}
