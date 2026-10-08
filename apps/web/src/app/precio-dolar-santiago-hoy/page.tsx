import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Dólar Santiago Hoy", item: "https://www.gamaex.cl/precio-dolar-santiago-hoy" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Dólar Santiago Hoy · Compra y Venta",
  description:
    "Precio del dólar hoy en Santiago. Gamaex publica los valores de compra y venta USD/CLP actualizados diariamente. Sin comisiones, atención en Providencia.",
  keywords: [
    "precio dolar santiago hoy",
    "valor dolar santiago hoy",
    "dolar hoy santiago chile",
    "USD CLP precio hoy",
    "tipo de cambio dolar santiago",
    "cotizacion dolar hoy santiago",
    "comprar vender dolar santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-dolar-santiago-hoy",
  },
  openGraph: {
    title: "Precio Dólar Santiago Hoy | USD/CLP — Gamaex",
    description: "Precio del dólar hoy en Santiago, actualizado diariamente en Gamaex Providencia.",
    url: "https://www.gamaex.cl/precio-dolar-santiago-hoy",
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

export default async function PrecioDolarSantiagoHoyPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio dólar hoy en ", h1Accent: "Santiago", heroDesc: "Precio del dólar en Santiago actualizado hoy. Consulta el USD/CLP y cambia tus divisas en Gamaex Providencia sin comisiones.", articleHeading: "¿Cuál es el precio del dólar en Santiago hoy?", articleText: "El precio del dólar en Santiago hoy lo tienes a la vista en esta página: la tabla de tasas y la calculadora en vivo se actualizan con el valor del día para compra y venta. Con eso calculas al instante cuántos pesos chilenos recibes o necesitas. En Gamaex operamos a ese precio publicado, sin comisiones, en el corazón de Providencia, sin reservas y sin abrir cuenta.\n\nEl precio del dólar en Santiago no es un número fijo: se ajusta día a día e incluso dentro de la misma jornada. Detrás de esos movimientos están el precio internacional del cobre, el comportamiento global del dólar, las tasas de interés y el pulso económico local. Justamente por eso no fijamos una cifra en el texto: el valor vigente aparece en la calculadora y la tabla de esta página, que muestran el precio del día en tiempo real.\n\nVen a cambiar en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia (Línea 1) y bien conectado con toda la ciudad. Somos una casa de cambio familiar en funcionamiento desde 1988, con atención presencial y más de 40 divisas. Para montos altos solicitamos la cédula de identidad según la normativa UAF, y puedes escribirnos por WhatsApp para confirmar los billetes antes de acercarte. Cambias en el momento, sin filas de banco ni papeleo." }} />
    </>
  );
}
