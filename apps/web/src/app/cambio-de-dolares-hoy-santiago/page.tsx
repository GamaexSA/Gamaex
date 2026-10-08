import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio de Dólares Hoy Santiago", item: "https://www.gamaex.cl/cambio-de-dolares-hoy-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Dólares Hoy en Santiago · USD/CLP",
  description:
    "Cambio de dólares hoy en Santiago. Precio USD/CLP de compra y venta actualizado en Gamaex Providencia. Sin comisiones ocultas, 38 años de experiencia.",
  keywords: [
    "cambio de dolares hoy santiago",
    "cambio dolares santiago hoy",
    "precio dolar hoy santiago compra venta",
    "donde cambiar dolares hoy santiago",
    "USD CLP hoy santiago",
    "cotizacion dolar hoy santiago",
    "tipo cambio dolares santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-hoy-chile",
  },
  openGraph: {
    title: "Cambio de Dólares Hoy Santiago | USD/CLP — Gamaex",
    description: "Precio del dólar hoy en Santiago. Gamaex Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-de-dolares-hoy-santiago",
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

export default async function CambioDeDolaresHoySantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de dólares hoy en ", h1Accent: "Santiago", heroDesc: "Precio del dólar actualizado hoy en Santiago. Cambia USD en Gamaex, Providencia — sin comisiones, atención directa.", articleHeading: "¿Dónde cambiar dólares hoy en Santiago?", articleText: "Si buscas el cambio de dólares hoy en Santiago, aquí tienes un valor referencial: la tabla de tasas y la calculadora de esta página muestran el precio del día, que cambia durante la jornada, para que te hagas una idea de cuántos pesos chilenos obtienes. El precio final se confirma por WhatsApp y en Gamaex cambias sin comisiones, en pleno Providencia. No necesitas reservar hora ni abrir cuenta; llegas y realizas la operación de inmediato.\n\nEn una ciudad como Santiago el tipo de cambio no es estático: varía a diario e incluso durante el día según el mercado internacional, el precio del cobre, el valor global del dólar y las condiciones económicas del momento. Por eso te mostramos el número vigente en la propia página en lugar de una cifra que quedaría desactualizada. Antes de venir, revisa la calculadora para tener una referencia clara de tu cambio.\n\nNos encuentras en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia (Línea 1), muy accesible desde cualquier punto de Santiago. Somos una casa de cambio familiar que atiende de manera presencial desde 1988, con más de 40 divisas disponibles. Para montos altos pedimos tu cédula de identidad conforme a la UAF, y puedes escribirnos por WhatsApp para confirmar los billetes que necesitas. Así aseguras un cambio rápido y sin vueltas." }} />
    </>
  );
}
