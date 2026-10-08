import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Dólar Canadiense Chile", item: "https://www.gamaex.cl/cambio-dolar-canadiense-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Dólar Canadiense en Chile · CAD/CLP",
  description:
    "Compra y vende dólares canadienses en Gamaex, Providencia. Precio CAD/CLP actualizado, 38 años de trayectoria, atención directa sin comisiones.",
  keywords: [
    "cambio dolar canadiense chile",
    "comprar dolares canadienses santiago",
    "vender dolares canadienses chile",
    "CAD CLP precio hoy",
    "tipo de cambio dolar canadiense chile",
    "cotizacion dolar canadiense santiago",
    "casa de cambio dolar canadiense",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-canadiense-chile",
  },
  openGraph: {
    title: "Cambio Dólar Canadiense Chile | CAD/CLP — Gamaex",
    description: "Precio CAD/CLP actualizado. Compra y venta de dólares canadienses en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-dolar-canadiense-chile",
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

export default async function CambioDolarCanadiensePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio dólar ", h1Accent: "canadiense en Chile", heroDesc: "Compra y venta de dólar canadiense (CAD) en Gamaex, Providencia. Cotización CAD/CLP actualizada, sin comisiones, atención directa.", articleHeading: "¿Dónde compro dólares canadienses para mi viaje o estudios en Canadá?", articleText: "El dólar canadiense (CAD) lo buscan en Chile estudiantes que parten a Toronto, Vancouver o Montreal, familias que visitan a parientes instalados en Canadá, y viajeros que van tras los paisajes, las Rocallosas o el otoño canadiense. También lo cambian quienes emigraron por trabajo o residencia y necesitan efectivo para sus primeros días. Al ser una moneda de Norteamérica distinta del dólar estadounidense, conviene conseguirla en un lugar que la maneje de forma habitual.\n\nEn Gamaex compras y vendes dólares canadienses al precio del día, publicado con transparencia en la tabla de tasas y en la calculadora de la misma página, sin comisiones ni cargos ocultos. Nuestro local está en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin reserva previa. Como el CAD no siempre está en stock en grandes cantidades, lo más práctico es escribirnos por WhatsApp antes de venir para confirmar disponibilidad de billetes en el monto que necesitas.\n\nGamaex atiende desde 1988 como empresa familiar y está a pasos del Metro Pedro de Valdivia, en la Línea 1, con acceso cómodo desde cualquier comuna. No somos banco: la operación es inmediata y no requiere abrir cuenta. Para montos altos se solicita la cédula de identidad y se registra la operación según la normativa UAF. Consulta el valor actualizado del día y cambia tus dólares canadienses de forma clara, presencial y con la tasa siempre publicada antes de decidir." }} />
    </>
  );
}
