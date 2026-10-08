import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Pago a Proveedores Moneda Extranjera", item: "https://www.gamaex.cl/pago-proveedores-moneda-extranjera" },
  ],
});

export const metadata: Metadata = {
  title: "Pago a Proveedores en Moneda Extranjera",
  description:
    "Paga a tus proveedores en moneda extranjera con Gamaex. Transferencias internacionales en USD, EUR y más. Condiciones especiales para empresas.",
  keywords: [
    "pago proveedores moneda extranjera chile",
    "transferencia internacional proveedores chile",
    "pagar en dolares a proveedores",
    "pago en divisas empresas chile",
    "transferir dolares proveedores santiago",
    "cambio divisas empresas chile",
    "pago internacional chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/pago-proveedores-moneda-extranjera",
  },
  openGraph: {
    title: "Pago a Proveedores Moneda Extranjera | Gamaex Chile",
    description: "Transferencias internacionales y pago a proveedores en divisas. Condiciones para empresas.",
    url: "https://www.gamaex.cl/pago-proveedores-moneda-extranjera",
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

export default async function PagoProveedoresPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Pago a proveedores en ", h1Accent: "moneda extranjera", heroDesc: "Paga a tus proveedores en moneda extranjera con Gamaex. Condiciones especiales para empresas, transferencias internacionales y divisas.", articleHeading: "¿Cómo pagar a proveedores en moneda extranjera desde Chile?", articleText: "Para empresas e importadores que necesitan pagar a proveedores en moneda extranjera, en esta página está el precio del día en vivo de más de 40 divisas. La tabla de tasas y la calculadora te permiten estimar al instante cuántos pesos chilenos requieres para reunir el efectivo en la moneda de tu operación. En Gamaex cambias a ese valor publicado, sin comisiones, de forma presencial y sin necesidad de abrir cuenta.\n\nAl planificar pagos conviene recordar que el tipo de cambio se mueve a diario, según el precio internacional del cobre, la fortaleza global del dólar, las tasas de interés y el contexto económico local y externo. Por eso mostramos el valor vigente en la propia página en vez de cifras fijas que quedarían desactualizadas. Revisa la calculadora al momento de tu operación para trabajar con el precio del día y ajustar tus montos.\n\nAtendemos a empresas y personas en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia (Línea 1). Gamaex opera como casa de cambio familiar desde 1988, con trato presencial y más de 40 divisas. Para montos altos se solicita la cédula de identidad conforme a la normativa UAF, y te recomendamos coordinar por WhatsApp con anticipación para confirmar la disponibilidad de la divisa y los billetes que tu pago requiere. Así aseguras el efectivo el día que lo necesitas." }} />
    </>
  );
}
