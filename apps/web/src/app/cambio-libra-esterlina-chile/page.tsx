import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Libra Esterlina Chile", item: "https://www.gamaex.cl/cambio-libra-esterlina-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Libra Esterlina en Chile · GBP/CLP",
  description:
    "Compra y vende libras esterlinas en Gamaex, Providencia. Precio GBP/CLP actualizado, 38 años de trayectoria, atención directa sin comisiones ocultas.",
  keywords: [
    "cambio libra esterlina chile",
    "comprar libras esterlinas santiago",
    "vender libras esterlinas chile",
    "GBP CLP precio hoy",
    "tipo de cambio libra esterlina chile",
    "cotizacion libra esterlina santiago",
    "casa de cambio libras santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-libra-esterlina-chile",
  },
  openGraph: {
    title: "Cambio Libra Esterlina Chile | GBP/CLP — Gamaex",
    description: "Precio GBP/CLP actualizado. Compra y venta de libras esterlinas en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-libra-esterlina-chile",
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

export default async function CambioLibraEsterlinaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio libra esterlina ", h1Accent: "en Chile", heroDesc: "Compra y venta de libras esterlinas (GBP) en Gamaex, Providencia. Cotización GBP/CLP actualizada, sin comisiones.", articleHeading: "¿Dónde cambio libras esterlinas en Santiago sin comisiones ocultas?", articleText: "La libra esterlina (GBP) la buscan en Chile quienes viajan al Reino Unido por turismo, estudiantes que parten a estudiar a Londres u otras ciudades, y profesionales que asisten a congresos o reuniones de trabajo. También la requieren familias con parientes en Inglaterra o Escocia y viajeros que combinan Europa continental con una parada en el Reino Unido. Al ser una de las divisas de referencia mundial, tiene demanda estable durante todo el año.\n\nEn Gamaex compras y vendes libras esterlinas al precio del día, siempre visible en la tabla de tasas y en la calculadora del propio sitio, sin comisiones ni cargos escondidos. Estamos en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin necesidad de reservar hora. Si vas a cambiar un monto alto, te recomendamos confirmar disponibilidad de billetes por WhatsApp antes de acercarte, para asegurar que tengamos las denominaciones que necesitas listas.\n\nGamaex opera desde 1988 como casa de cambio familiar y se ubica a pasos del Metro Pedro de Valdivia, en la Línea 1, con llegada fácil desde toda la ciudad. No somos banco: cambias en el momento, sin abrir cuenta ni esperar. Para montos altos se pide la cédula de identidad y se registra la operación conforme a la normativa UAF. Consulta el valor actualizado del día y resuelve tu cambio de libras con la tasa a la vista, cara a cara y sin sorpresas al momento de pagar." }} />
    </>
  );
}
