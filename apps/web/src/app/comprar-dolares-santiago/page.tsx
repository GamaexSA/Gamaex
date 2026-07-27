import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Dólares en Santiago", item: "https://www.gamaex.cl/comprar-dolares-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Dólares en Santiago · USD/CLP Hoy",
  description:
    "¿Dónde comprar dólares en Santiago? Gamaex en Providencia: 38 años de trayectoria, sin comisiones ocultas, a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "comprar dolares santiago",
    "donde comprar dolares en santiago",
    "comprar dolares providencia",
    "comprar USD chile",
    "comprar divisas santiago",
    "mejor precio dolares santiago",
    "comprar dolares sin comision santiago",
    "cambio dolar compra providencia",
    "comprar dolares metro pedro de valdivia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-dolares-santiago",
  },
  openGraph: {
    title: "Comprar Dólares en Santiago | Gamaex Chile — Providencia",
    description:
      "38 años cambiando moneda en Providencia. Precios finales, sin comisiones. Metro Pedro de Valdivia.",
    url: "https://www.gamaex.cl/comprar-dolares-santiago",
  },
};

async function getRates(): Promise<PublicRatesResponse> {
  const empty: PublicRatesResponse = {
    rates: [],
    system_status: "stale",
    last_sync_at: "",
    cache_ttl_seconds: 60,
  };
  try {
    const url = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/rates/public`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return res.json() as Promise<PublicRatesResponse>;
  } catch {
    return empty;
  }
}

export default async function ComprarDolaresSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar dólares en ", h1Accent: "Santiago", heroDesc: "El mejor lugar para comprar dólares en Santiago. Gamaex en Providencia — cotización USD/CLP actualizada, sin comisiones.", articleHeading: "¿Dónde comprar dólares en Santiago?", articleText: "Comprar dólares en Santiago conviene hacerlo en una casa de cambio establecida, con local físico y precio publicado, y no en la calle ni con particulares. Gamaex opera desde 1988 en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia (Línea 1), con atención presencial sin necesidad de reserva. El precio de venta del dólar se actualiza a diario y lo ves en vivo en la tabla de tasas y en la calculadora de esta página, sin comisiones ni cargos ocultos.\n\nPara comprar solo necesitas llevar tus pesos chilenos en efectivo y tu cédula de identidad. En operaciones de monto alto, la normativa de la Unidad de Análisis Financiero (UAF) exige identificar al cliente y registrar la transacción, así que conviene traer tu documento. Si vas a cambiar una suma importante, escríbenos antes por WhatsApp para confirmar la disponibilidad de billetes y agilizar la atención en el local.\n\nA diferencia de un banco, en Gamaex no necesitas abrir una cuenta ni esperar aprobaciones: la operación es inmediata y al precio del momento. Usa la calculadora para estimar cuántos pesos necesitas por los dólares que quieres comprar hoy, o déjanos tus datos y te contactamos." }} />
    </>
  );
}
