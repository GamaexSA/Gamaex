import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Yen Japonés Chile", item: "https://www.gamaex.cl/cambio-yen-japones-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Yen Japonés en Chile · JPY/CLP Hoy",
  description:
    "Compra y vende yenes japoneses en Gamaex, Providencia. Precio JPY/CLP actualizado, sin comisiones, a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "cambio yen japones chile",
    "comprar yenes santiago",
    "vender yenes chile",
    "JPY CLP precio hoy",
    "tipo de cambio yen chile",
    "cotizacion yen japones santiago",
    "casa de cambio yen santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-yen-japones-chile",
  },
  openGraph: {
    title: "Cambio Yen Japonés Chile | JPY/CLP — Gamaex",
    description: "Precio JPY/CLP actualizado. Compra y venta de yenes japoneses en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-yen-japones-chile",
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

export default async function CambioYenJaponesPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio yen ", h1Accent: "japonés en Chile", heroDesc: "Compra y venta de yen japonés (JPY) en Gamaex, Providencia. Cotización JPY/CLP actualizada, sin comisiones.", articleHeading: "¿Dónde consigo yenes japoneses antes de viajar a Japón?", articleText: "El yen japonés (JPY) lo buscan en Chile viajeros que van a conocer Tokio, Kioto y la temporada de cerezos, aficionados a la cultura japonesa, y profesionales que asisten a ferias tecnológicas o reuniones de negocios. También lo requieren estudiantes de intercambio y familias que visitan a parientes en Japón. Como en muchos lugares del país todavía se usa harto efectivo, llegar con yenes en mano suele ser muy práctico para los primeros días de viaje.\n\nEn Gamaex compras y vendes yenes japoneses al precio del día, siempre visible en la tabla de tasas y en la calculadora del propio sitio, sin comisiones ni cargos escondidos. Estamos en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin necesidad de reservar hora. Como el yen no es de circulación masiva en el comercio local, te recomendamos confirmar disponibilidad de billetes por WhatsApp antes de acercarte, sobre todo si necesitas un monto importante para tu viaje.\n\nGamaex opera desde 1988 como casa de cambio familiar y se ubica a pasos del Metro Pedro de Valdivia, en la Línea 1, con acceso simple desde toda la ciudad. No somos banco: cambias en el momento, sin abrir cuenta ni trámites largos. Para montos altos se pide la cédula de identidad y se registra la operación según la normativa UAF. Consulta el valor actualizado del día y resuelve tus yenes con la tasa a la vista, cara a cara y con total claridad." }} />
    </>
  );
}
