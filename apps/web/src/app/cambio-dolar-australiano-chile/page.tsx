import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Dólar Australiano Chile", item: "https://www.gamaex.cl/cambio-dolar-australiano-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Dólar Australiano en Chile · AUD/CLP",
  description:
    "Compra y vende dólares australianos en Gamaex, Providencia. Precio AUD/CLP actualizado, sin comisiones. 38 años de experiencia en cambio de divisas.",
  keywords: [
    "cambio dolar australiano chile",
    "comprar dolares australianos santiago",
    "vender dolares australianos chile",
    "AUD CLP precio hoy",
    "tipo de cambio dolar australiano chile",
    "cotizacion dolar australiano santiago",
    "casa de cambio dolar australiano",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-australiano-chile",
  },
  openGraph: {
    title: "Cambio Dólar Australiano Chile | AUD/CLP — Gamaex",
    description: "Precio AUD/CLP actualizado. Compra y venta de dólares australianos en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-dolar-australiano-chile",
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

export default async function CambioDolarAustralianPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio dólar ", h1Accent: "australiano en Chile", heroDesc: "Compra y venta de dólar australiano (AUD) en Gamaex, Providencia. Cotización AUD/CLP actualizada, sin comisiones.", articleHeading: "¿Cómo consigo dólares australianos antes de viajar o mudarme a Australia?", articleText: "El dólar australiano (AUD) tiene un público muy claro en Chile: estudiantes que parten a cursar inglés o carreras en Sídney y Melbourne, jóvenes con visa de trabajo y vacaciones, y familias que van a visitar a parientes instalados allá. También lo cambian quienes vuelven de una estadía larga y traen billetes que ya no van a usar. Al ser una divisa de Oceanía, no siempre está a mano en el comercio, por lo que anticiparse ayuda a evitar apuros de último minuto.\n\nEn Gamaex encontrarás compra y venta de dólares australianos al precio del día, publicado de forma transparente en la tabla de tasas y en la calculadora del sitio, sin comisiones ni sorpresas al momento de pagar. Estamos en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin necesidad de reservar hora. Como el AUD no es de las monedas de mayor circulación diaria, te recomendamos confirmar disponibilidad de billetes por WhatsApp antes de acercarte, sobre todo si necesitas un monto importante para tu viaje.\n\nOperamos desde 1988 como empresa familiar y estamos a pasos del Metro Pedro de Valdivia, en la Línea 1, lo que hace fácil pasar antes o después de otros trámites. No somos banco: cambias tus dólares australianos en el momento, sin abrir cuenta. Para montos altos se pide la cédula de identidad y se registra la operación conforme a la normativa UAF. Consulta el valor actualizado del día y resuelve tu cambio con la tasa siempre a la vista." }} />
    </>
  );
}
