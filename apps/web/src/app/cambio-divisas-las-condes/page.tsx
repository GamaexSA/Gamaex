import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Divisas Las Condes", item: "https://www.gamaex.cl/cambio-divisas-las-condes" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Divisas Las Condes · USD, EUR y Más",
  description:
    "Cambio de divisas cercano a Las Condes. Gamaex en Av. Pedro de Valdivia 020, Providencia. Más de 40 monedas, sin comisiones, 38 años de experiencia.",
  keywords: [
    "cambio divisas las condes",
    "casa de cambio las condes providencia",
    "comprar dolares las condes santiago",
    "donde cambiar moneda las condes",
    "divisas las condes santiago",
    "cambio moneda extranjera las condes",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-divisas-las-condes",
  },
  openGraph: {
    title: "Cambio Divisas Las Condes | Gamaex Providencia",
    description: "Cambio de divisas cercano a Las Condes. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-divisas-las-condes",
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

export default async function CambioDivisasLasCondesPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de divisas · ", h1Accent: "Las Condes", heroDesc: "Cambio de divisas cercano a Las Condes. Gamaex en Av. Pedro de Valdivia 020, Providencia — USD, EUR y +40 monedas sin comisiones.", articleHeading: "¿Dónde cambiar divisas cerca de Las Condes?", articleText: "Las Condes concentra oficinas, torres corporativas y viajeros frecuentes que necesitan cambiar divisas antes de un viaje o al volver del extranjero. Entre Apoquindo, El Golf y Escuela Militar es común buscar una casa de cambio confiable y con precio claro, sin dar tantas vueltas ni depender del horario bancario. Si estás por el sector oriente y quieres una alternativa cercana y con atención presencial, Gamaex en Providencia queda a pocos minutos.\n\nLlegar desde Las Condes es sencillo. Por Metro, toma la Línea 1 en Escuela Militar, Tobalaba o Los Leones en dirección al poniente y bájate en Pedro de Valdivia; usando la salida oriente quedas prácticamente en la puerta. En auto, baja por Av. Apoquindo que se transforma en Av. Providencia y sigue hasta la altura de Pedro de Valdivia. Son apenas unos minutos desde el corazón de Las Condes.\n\nGamaex funciona desde 1988 como casa de cambio familiar en Av. Pedro de Valdivia 020. Trabaja más de 40 divisas, publica el precio del día y opera sin comisiones, con calculadora y tabla de tasas en vivo en esta página. La atención es presencial y sin reserva; para montos altos se pide cédula por normativa UAF y puedes escribir por WhatsApp para confirmar billetes antes de ir. No es un banco: la operación es inmediata." }} />
    </>
  );
}
