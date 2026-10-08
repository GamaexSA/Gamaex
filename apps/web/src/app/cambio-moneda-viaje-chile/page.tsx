import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Moneda Viaje Chile", item: "https://www.gamaex.cl/cambio-moneda-viaje-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Moneda para Viaje · +40 Divisas",
  description:
    "Cambia moneda para tu viaje en Gamaex, Providencia. USD, EUR, GBP, BRL y +40 divisas al mejor precio, sin comisiones. Lleva el efectivo que necesitas.",
  keywords: [
    "cambio moneda viaje chile",
    "donde cambiar moneda para viajar chile",
    "divisas para viaje santiago",
    "comprar moneda extranjera viaje",
    "cambio divisas antes de viajar",
    "moneda extranjera viaje providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-moneda-viaje-chile",
  },
  openGraph: {
    title: "Cambio de Moneda para Viaje | Gamaex Chile",
    description: "Prepara las divisas para tu viaje en Gamaex Providencia. Más de 40 monedas, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-moneda-viaje-chile",
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

export default async function CambioMonedaViajeChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Divisas para tu ", h1Accent: "viaje desde Chile", heroDesc: "Prepara las divisas para tu próximo viaje en Gamaex, Providencia. USD, EUR, BRL y +40 monedas al mejor precio, sin comisiones.", articleHeading: "¿Dónde cambiar moneda para mi viaje en Chile?", articleText: "Si necesitas cambiar moneda para un viaje, en esta página ves en vivo el precio del día de más de 40 divisas. La tabla de tasas y la calculadora te permiten saber al instante cuántos pesos chilenos recibes por tu moneda extranjera, o cuánta divisa obtienes con tus pesos antes de partir. En Gamaex cambias a ese valor, sin comisiones, de forma presencial y sin necesidad de reservar ni abrir cuenta.\n\nLos tipos de cambio se mueven todos los días, así que el valor de la moneda de tu destino puede variar entre hoy y la fecha de tu viaje. Esos movimientos dependen del mercado internacional, las tasas de interés, el precio del cobre y el contexto económico global. Por eso mostramos las cifras vigentes en la propia página en lugar de números fijos: revisa la calculadora para planificar tu presupuesto con el precio del día.\n\nPrepara tu viaje pasando por Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1. Somos una casa de cambio familiar que atiende desde 1988, con más de 40 divisas disponibles. Para montos altos se solicita la cédula de identidad según la normativa UAF, y puedes escribirnos por WhatsApp para confirmar que tengamos la moneda y los billetes de tu destino. Así llevas tu efectivo listo antes de volar." }} />
    </>
  );
}
