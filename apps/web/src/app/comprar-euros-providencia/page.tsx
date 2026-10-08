import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Euros Providencia", item: "https://www.gamaex.cl/comprar-euros-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Euros en Providencia · EUR Hoy",
  description:
    "Compra euros en Providencia. Gamaex en Av. Pedro de Valdivia 020: sin comisiones, cotización EUR/CLP actualizada a diario. 38 años de experiencia.",
  keywords: [
    "comprar euros providencia",
    "donde comprar euros en providencia",
    "precio euro providencia santiago",
    "cambio euros providencia",
    "EUR pesos chilenos providencia",
    "mejor precio euro providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-euros-providencia",
  },
  openGraph: {
    title: "Comprar Euros en Providencia | Gamaex",
    description: "Compra euros sin comisiones en Gamaex Providencia. Precio EUR actualizado.",
    url: "https://www.gamaex.cl/comprar-euros-providencia",
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

export default async function ComprarEurosProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Compra euros en ", h1Accent: "Providencia", heroDesc: "El mejor precio para comprar euros en Providencia. Gamaex en Av. Pedro de Valdivia 020 — cotización EUR/CLP actualizada, sin comisiones, atención directa.", articleHeading: "¿Dónde comprar euros en Providencia para tu viaje?", articleText: "Si estás organizando un viaje a Europa, llevar algo de efectivo en euros te ayuda a moverte los primeros días: transporte desde el aeropuerto, propinas, mercados y locales pequeños donde no siempre reciben tarjeta. Comprar euros con anticipación te permite hacerlo con calma, revisar las denominaciones y evitar apuros de última hora en el aeropuerto, donde las condiciones suelen ser menos convenientes.\n\nEn Gamaex vendemos euros al precio del día, sin comisiones ni cargos ocultos, en pleno Providencia. Antes de venir puedes mirar la tasa vigente en la tabla de esta página y usar la calculadora para saber cuántos pesos necesitas según los euros que quieras llevar. Como los billetes de ciertas denominaciones se agotan más rápido, conviene escribirnos por WhatsApp para confirmar disponibilidad y reservar tu atención.\n\nNos encuentras en Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia de la Línea 1, con atención presencial desde 1988 y sin reserva previa. Para compras de monto alto pedimos tu cédula de identidad y registramos la operación según la normativa de la UAF. No somos banco: compras tus euros en efectivo, al instante y sin abrir ninguna cuenta, ideal cuando el viaje ya tiene fecha y quieres dejar ese detalle resuelto." }} />
    </>
  );
}
