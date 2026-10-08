import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Conversor de Divisas Chile", item: "https://www.gamaex.cl/conversor-divisas-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Conversor de Divisas Chile · +40 Monedas",
  description:
    "Conversor de divisas para Chile. Calcula USD, EUR, BRL y más de 40 monedas en pesos chilenos. Precios reales de Gamaex, actualizados diariamente.",
  keywords: [
    "conversor divisas chile",
    "convertir divisas chile",
    "calculadora divisas chile",
    "conversor moneda chilena",
    "convertir dolares a pesos chilenos",
    "convertir euros a pesos chilenos",
    "conversor cambio de moneda chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/conversor-divisas-chile",
  },
  openGraph: {
    title: "Conversor de Divisas Chile | Gamaex — Precios reales",
    description: "Conversor de divisas con precios reales de Gamaex. USD, EUR, BRL y 40+ monedas.",
    url: "https://www.gamaex.cl/conversor-divisas-chile",
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

export default async function ConversorDivisasChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Conversor de ", h1Accent: "divisas en Chile", heroDesc: "Convierte cualquier moneda con los precios reales de Gamaex. USD, EUR, BRL y +40 divisas. Calcula y cotiza directamente por WhatsApp.", articleHeading: "¿Cómo convertir divisas a pesos chilenos hoy?", articleText: "El conversor de divisas de esta página funciona en vivo: la calculadora y la tabla de tasas usan el precio del día de más de 40 monedas para mostrarte, al instante, la equivalencia en pesos chilenos, o cuánta divisa obtienes con tus pesos. Solo ingresas el monto y ves el resultado con el valor actualizado. En Gamaex cambias exactamente a ese precio, sin comisiones, de forma presencial y sin reservar ni abrir cuenta.\n\nTen en cuenta que el conversor refleja un mercado que cambia a diario: el valor de cada divisa se ajusta según el precio internacional del cobre, la fortaleza global del dólar, las tasas de interés y el contexto económico local y externo. Por eso la calculadora se actualiza con el precio del día en lugar de mostrar cifras fijas. Úsala como referencia cada vez que la necesites, ya que el número puede variar de una jornada a otra.\n\nCuando quieras concretar el cambio, visítanos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia (Línea 1). Gamaex es una casa de cambio familiar que opera desde 1988, con atención presencial y más de 40 divisas. Para montos altos pedimos la cédula de identidad según la normativa UAF, y puedes escribirnos por WhatsApp para confirmar la disponibilidad de la moneda y los billetes. La operación se realiza en el momento." }} />
    </>
  );
}
