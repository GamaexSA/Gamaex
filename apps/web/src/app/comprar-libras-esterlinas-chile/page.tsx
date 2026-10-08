import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Libras Esterlinas Chile", item: "https://www.gamaex.cl/comprar-libras-esterlinas-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Libras Esterlinas en Chile · GBP/CLP",
  description:
    "Compra libras esterlinas en Chile al mejor precio. Gamaex en Providencia: cotización GBP/CLP actualizada, sin comisiones, atención directa.",
  keywords: [
    "comprar libras esterlinas chile",
    "donde comprar libras esterlinas santiago",
    "precio libra esterlina chile",
    "GBP CLP hoy",
    "comprar GBP santiago",
    "libras esterlinas providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-libras-esterlinas-chile",
  },
  openGraph: {
    title: "Comprar Libras Esterlinas Chile | Gamaex Providencia",
    description: "GBP/CLP actualizado. Compra libras esterlinas en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/comprar-libras-esterlinas-chile",
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

export default async function ComprarLibrasEsterlinasChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar libras esterlinas en ", h1Accent: "Chile", heroDesc: "Compra libras esterlinas (GBP) en Gamaex, Providencia. Cotización GBP/CLP actualizada, sin comisiones, atención directa.", articleHeading: "¿Cómo compro libras esterlinas en efectivo para mi viaje al Reino Unido?", articleText: "Comprar libras esterlinas (GBP) en efectivo es lo que necesitan quienes viajan al Reino Unido y quieren llegar con dinero en mano para el transporte, propinas y gastos de los primeros días. Suelen buscarlas turistas que van a Londres, Edimburgo o el campo inglés, estudiantes que parten a un programa académico, y profesionales con reuniones o congresos. Tener billetes desde antes evita depender solo de la tarjeta apenas aterrizas y da tranquilidad para moverse.\n\nEn Gamaex compras libras esterlinas al precio del día, publicado con claridad en la tabla de tasas y en la calculadora del sitio, sin comisiones ni cargos ocultos. Nuestro local está en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin reserva previa. Si vas a comprar un monto alto o necesitas billetes de denominaciones específicas, te recomendamos escribirnos por WhatsApp antes de venir para confirmar disponibilidad y dejar todo listo para cuando llegues.\n\nGamaex opera desde 1988 como casa de cambio familiar y está a pasos del Metro Pedro de Valdivia, en la Línea 1, con llegada fácil desde cualquier comuna. No somos banco: la compra es inmediata y no requiere abrir cuenta ni esperar. Para montos altos se solicita la cédula de identidad y se registra la operación según la normativa UAF. Consulta el valor actualizado del día y compra tus libras esterlinas de forma clara, presencial y con la tasa siempre a la vista antes de decidir." }} />
    </>
  );
}
