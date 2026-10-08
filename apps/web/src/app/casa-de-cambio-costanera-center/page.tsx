import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Costanera Center", item: "https://www.gamaex.cl/casa-de-cambio-costanera-center" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Costanera Center",
  description:
    "Casa de cambio cercana a Costanera Center. Gamaex en Av. Pedro de Valdivia 020, Providencia, a minutos a pie. +40 divisas, sin comisiones.",
  keywords: [
    "casa de cambio costanera center",
    "cambio divisas costanera center",
    "comprar dolares costanera center santiago",
    "casa de cambio cerca costanera center",
    "divisas costanera center providencia",
    "cambio moneda costanera center",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-costanera-center",
  },
  openGraph: {
    title: "Casa de Cambio cerca de Costanera Center | Gamaex",
    description: "Cambio de divisas a pasos de Costanera Center. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-costanera-center",
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

export default async function CasaDeCambioCostaneraPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · ", h1Accent: "Costanera Center", heroDesc: "Casa de cambio cercana a Costanera Center. Gamaex en Av. Pedro de Valdivia 020, Providencia — +40 divisas, sin comisiones.", articleHeading: "¿Dónde cambiar dinero cerca de Costanera Center?", articleText: "Costanera Center, junto al Metro Tobalaba, es punto de encuentro para compras, oficinas y visitantes del Sky Costanera. Entre el mall y las torres circulan muchos turistas y trabajadores que necesitan cambiar dólares, euros u otra divisa el mismo día. Antes de recorrer locales dentro del centro comercial, vale la pena saber que Gamaex, en Providencia, está a pocos minutos y publica su precio del día sin comisiones.\n\nDesde Costanera Center el acceso es cómodo. Entra al Metro por Tobalaba y toma la Línea 1 en dirección al poniente hasta Pedro de Valdivia: son solo un par de estaciones, pasando por Los Leones. Si prefieres caminar, baja por Av. Providencia en sentido al centro y llegas al sector de Pedro de Valdivia en un paseo corto. La salida oriente del metro deja la oficina a un costado.\n\nGamaex funciona desde 1988 en Av. Pedro de Valdivia 020, como casa de cambio familiar y presencial. Ofrece más de 40 divisas, con el precio del día a la vista y sin comisiones; en esta página tienes calculadora y tabla de tasas en vivo. Se atiende sin reserva. Para montos altos se pide cédula por la normativa UAF, y puedes escribir por WhatsApp para confirmar los billetes disponibles. No somos banco, así que la operación es inmediata." }} />
    </>
  );
}
