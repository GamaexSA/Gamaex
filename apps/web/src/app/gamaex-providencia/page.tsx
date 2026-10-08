import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Gamaex Providencia", item: "https://www.gamaex.cl/gamaex-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Gamaex Providencia · Casa de Cambio y Divisas",
  description:
    "Gamaex en Providencia, Santiago: Av. Pedro de Valdivia 020, a pasos del Metro. Casa de cambio con 38 años de trayectoria, sin comisiones.",
  keywords: [
    "gamaex providencia",
    "gamaex chile providencia",
    "gamaex casa de cambio providencia",
    "gamaex pedro de valdivia",
    "gamaex santiago",
    "gamaex divisas providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/gamaex-providencia",
  },
  openGraph: {
    title: "Gamaex Providencia | Casa de Cambio",
    description: "Gamaex en Av. Pedro de Valdivia 020, Providencia. Sin comisiones, 38 años.",
    url: "https://www.gamaex.cl/gamaex-providencia",
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

export default async function GamaexProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Gamaex — Casa de cambio en ", h1Accent: "Providencia", heroDesc: "Gamaex en Av. Pedro de Valdivia 020, Providencia — a pasos del Metro Pedro de Valdivia. Más de 38 años cambiando divisas sin comisiones.", articleHeading: "¿Dónde queda Gamaex en Providencia?", articleText: "Gamaex es una casa de cambio con base en Providencia, en Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia. Es una empresa familiar que atiende de forma presencial desde 1988, más de 38 años acompañando a quienes necesitan cambiar divisas en Santiago. Su ubicación, en pleno eje de Providencia, la hace fácil de alcanzar tanto para vecinos del sector como para quienes vienen del centro o del oriente.\n\nLlegar es directo. Por Metro, la estación Pedro de Valdivia de la Línea 1 deja la oficina prácticamente en la puerta si usas la salida oriente. Desde Los Leones, Manuel Montt, Tobalaba o Baquedano son solo unos minutos por la misma línea. En auto, la referencia es la esquina de Av. Providencia con Pedro de Valdivia, un punto central y reconocible dentro de la comuna.\n\nEn Gamaex se trabajan más de 40 divisas, siempre con el precio del día publicado y sin comisiones; la calculadora y la tabla de tasas en vivo están disponibles en esta página. La atención es sin reserva. Para montos altos se pide cédula según la normativa UAF y puedes confirmar la disponibilidad de billetes por WhatsApp antes de acercarte. Al no ser un banco, la operación es inmediata y se resuelve en el mismo mostrador." }} />
    </>
  );
}
