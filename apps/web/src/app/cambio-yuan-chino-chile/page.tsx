import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Yuan Chino Chile", item: "https://www.gamaex.cl/cambio-yuan-chino-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Yuan Chino en Chile · CNY/CLP Hoy",
  description:
    "Compra y vende yuanes chinos en Gamaex, Providencia. Precio CNY/CLP actualizado, sin comisiones. Especialistas en divisas asiáticas.",
  keywords: [
    "cambio yuan chino chile",
    "comprar yuanes santiago",
    "CNY CLP precio hoy",
    "tipo de cambio yuan china chile",
    "yuan chino a peso chileno",
    "renminbi chile",
    "casa de cambio yuan santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-yuan-chino-chile",
  },
  openGraph: {
    title: "Cambio Yuan Chino Chile | CNY/CLP — Gamaex",
    description: "Precio CNY/CLP actualizado. Compra y venta de yuanes en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-yuan-chino-chile",
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

export default async function CambioYuanChinoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio yuan ", h1Accent: "chino en Chile", heroDesc: "Compra y venta de yuan chino (CNY) en Gamaex, Providencia. Cotización CNY/CLP actualizada, sin comisiones.", articleHeading: "¿Dónde cambio yuanes chinos en Santiago para viaje o negocios?", articleText: "El yuan chino o renminbi (CNY) lo buscan en Chile quienes viajan a China por turismo o negocios, importadores y comerciantes que visitan ferias como la de Cantón, y profesionales con reuniones en Shanghái o Pekín. También lo requieren estudiantes y personas con vínculos familiares o comerciales con el país. Dada la relación comercial cada vez más estrecha entre Chile y China, es una moneda con demanda constante entre quienes viajan por trabajo.\n\nEn Gamaex compras y vendes yuanes al precio del día, publicado con transparencia en la tabla de tasas y en la calculadora de la misma página, sin comisiones ni cargos ocultos. Nuestro local está en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin reserva previa. Como el yuan no es de las divisas de mayor circulación diaria en Chile, lo más práctico es escribirnos por WhatsApp antes de venir para confirmar disponibilidad de billetes en el monto que necesitas.\n\nGamaex atiende desde 1988 como empresa familiar y está a pasos del Metro Pedro de Valdivia, en la Línea 1, con llegada cómoda desde cualquier comuna. No somos banco: la operación es inmediata y no requiere abrir cuenta. Para montos altos se solicita la cédula de identidad y se registra la operación según la normativa UAF. Consulta el valor actualizado del día y cambia tus yuanes de forma clara, presencial y con la tasa siempre a la vista antes de decidir." }} />
    </>
  );
}
