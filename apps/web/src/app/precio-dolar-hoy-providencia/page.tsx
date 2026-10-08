import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Dólar Hoy Providencia", item: "https://www.gamaex.cl/precio-dolar-hoy-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Dólar Hoy en Providencia · USD/CLP",
  description:
    "Consulta el precio del dólar hoy en Providencia. Gamaex actualiza la cotización USD/CLP cada hora. Sin comisiones, en Av. Pedro de Valdivia 020.",
  keywords: [
    "precio dolar hoy providencia",
    "cotizacion dolar providencia",
    "tipo de cambio dolar providencia",
    "dolar hoy providencia santiago",
    "USD CLP providencia hoy",
    "comprar dolar providencia precio",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-dolar-hoy-providencia",
  },
  openGraph: {
    title: "Precio Dólar Hoy Providencia | Gamaex",
    description: "Cotización USD/CLP actualizada en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/precio-dolar-hoy-providencia",
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

export default async function PrecioDolarHoyProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio del dólar hoy en ", h1Accent: "Providencia", heroDesc: "Precio del dólar actualizado hoy en Providencia. Gamaex en Av. Pedro de Valdivia 020 — cotización USD/CLP en tiempo real.", articleHeading: "¿Cómo saber el precio del dólar hoy en Providencia?", articleText: "El precio del dólar cambia día a día, por eso quienes están en Providencia suelen querer conocer el valor actualizado antes de acercarse a una casa de cambio. En esta página puedes revisar el precio del día que maneja Gamaex y usar la calculadora para estimar cuánto recibes según el monto, sin sorpresas y sin comisiones. Así llegas con una idea clara antes de hacer tu cambio en el sector.\n\nSi decides venir, la oficina de Gamaex está en Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia en la Línea 1. Desde el centro, Baquedano, Manuel Montt, Los Leones o Tobalaba llegas en pocos minutos por la misma línea, y la salida oriente del metro te deja casi en la puerta. También es un punto fácil de ubicar caminando por Av. Providencia, en pleno eje de la comuna.\n\nTen presente que el valor mostrado corresponde al precio del día y puede variar según el mercado, por lo que conviene revisarlo el mismo día de tu operación. Gamaex atiende desde 1988 como casa de cambio familiar y presencial, con más de 40 divisas y sin comisiones. Para montos altos se pide cédula por normativa UAF y puedes confirmar billetes por WhatsApp. Al no ser banco, el cambio se realiza de inmediato." }} />
    </>
  );
}
