import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Dólar Euro Santiago", item: "https://www.gamaex.cl/cambio-dolar-euro-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Dólar y Euro en Santiago · USD y EUR",
  description:
    "Cambia dólares y euros en Gamaex, Providencia. USD/CLP y EUR/CLP actualizados a diario, sin comisiones, atención directa. 38 años en Santiago.",
  keywords: [
    "cambio dolar euro santiago",
    "comprar dolar y euro santiago",
    "USD EUR CLP santiago",
    "precio dolar euro chile hoy",
    "casa de cambio dolar euro providencia",
    "cambio divisas dolar euro santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-euro-santiago",
  },
  openGraph: {
    title: "Cambio Dólar y Euro Santiago | Gamaex Providencia",
    description: "USD/CLP y EUR/CLP actualizados en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/cambio-dolar-euro-santiago",
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

export default async function CambioDolarEuroSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio dólar y euro en ", h1Accent: "Santiago", heroDesc: "USD/CLP y EUR/CLP actualizados en Gamaex, Providencia. Compra y venta de dólares y euros en Santiago sin comisiones.", articleHeading: "¿Dónde cambiar dólares y euros en Santiago el mismo día?", articleText: "El dólar y el euro son las dos divisas más consultadas en Chile: el primero por su uso global en viajes y comercio, y el segundo por quienes van o vuelven de Europa. Muchas veces se necesitan ambas en una sola visita, por ejemplo al preparar un viaje con escalas o al cerrar cuentas después de andar por varios países. Cada una tiene su propio valor, que se mueve a diario según los mercados.\n\nEn Gamaex cambiamos dólares y euros al precio publicado del día, sin comisiones ni cargos ocultos. Puedes revisar ambas tasas en la tabla de esta página y usar la calculadora para estimar tus dos operaciones antes de venir. Al hacerlo en un mismo lugar ahorras vueltas y comparas los valores con calma. Si el monto es alto o buscas denominaciones específicas, escríbenos por WhatsApp para confirmar disponibilidad de billetes.\n\nAtendemos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1, de forma presencial desde 1988 y sin reserva previa. Para operaciones de mayor volumen pedimos tu cédula de identidad y las registramos según la normativa de la UAF. No somos banco: resuelves el cambio de ambas monedas en el momento, en efectivo y sin abrir ninguna cuenta." }} />
    </>
  );
}
