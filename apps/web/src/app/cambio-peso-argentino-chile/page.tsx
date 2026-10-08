import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Peso Argentino Chile", item: "https://www.gamaex.cl/cambio-peso-argentino-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Peso Argentino en Chile · ARS/CLP",
  description:
    "Compra y vende pesos argentinos en Gamaex, Providencia. Precio ARS/CLP actualizado al día. 38 años de experiencia. Sin comisiones ocultas.",
  keywords: [
    "cambio peso argentino chile",
    "comprar pesos argentinos santiago",
    "vender pesos argentinos chile",
    "ARS CLP precio hoy",
    "tipo de cambio peso argentino chile",
    "cotizacion peso argentino santiago",
    "casa de cambio pesos argentinos",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-peso-argentino-chile",
  },
  openGraph: {
    title: "Cambio Peso Argentino Chile | ARS/CLP — Gamaex",
    description: "Precio ARS/CLP actualizado. Compra y venta de pesos argentinos en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-peso-argentino-chile",
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

export default async function CambioPesoArgentinoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio peso ", h1Accent: "argentino en Chile", heroDesc: "Compra y venta de pesos argentinos (ARS) en Gamaex, Providencia. Cotización ARS/CLP actualizada, sin comisiones.", articleHeading: "¿Conviene cambiar pesos argentinos en Chile antes de cruzar la cordillera?", articleText: "El peso argentino (ARS) es de las monedas más consultadas por la cercanía entre ambos países. Lo buscan quienes cruzan a Mendoza en auto por el fin de semana, familias que veranean en la costa argentina, y chilenos con parientes o negocios al otro lado de la cordillera. También lo traen de vuelta viajeros que regresan con billetes y prefieren convertirlos a pesos chilenos en un lugar formal. Es una moneda con harta demanda de temporada, sobre todo en vacaciones y fines de semana largos.\n\nEn Gamaex compras y vendes pesos argentinos al precio del día, siempre visible en la tabla de tasas y en la calculadora del sitio, sin comisiones ni cargos escondidos. Estamos en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin necesidad de reservar hora. Como el valor del peso argentino se mueve seguido, te recomendamos revisar la tasa actualizada del día antes de operar, y si necesitas un monto alto, confirmar disponibilidad de billetes por WhatsApp antes de acercarte.\n\nOperamos desde 1988 como casa de cambio familiar y estamos a pasos del Metro Pedro de Valdivia, en la Línea 1, así que llegar es simple aunque vengas de paso. No somos banco: cambias en el momento, sin abrir cuenta ni trámites largos. Para montos altos se pide la cédula de identidad y se registra la operación según la normativa UAF. Consulta el valor actualizado y resuelve tu cambio de pesos argentinos con la tasa siempre a la vista." }} />
    </>
  );
}
