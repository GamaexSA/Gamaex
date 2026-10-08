import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Metro Tobalaba", item: "https://www.gamaex.cl/casa-de-cambio-metro-tobalaba" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Metro Tobalaba",
  description:
    "Casa de cambio cerca del Metro Tobalaba. Gamaex en Av. Pedro de Valdivia 020, Providencia, a pocas cuadras de la estación. Sin comisiones, 38 años.",
  keywords: [
    "casa de cambio metro tobalaba",
    "cambio divisas tobalaba",
    "comprar dolares metro tobalaba santiago",
    "casa de cambio cerca metro tobalaba",
    "divisas tobalaba providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-metro-tobalaba",
  },
  openGraph: {
    title: "Casa de cambio cerca de Metro Tobalaba — Gamaex Providencia",
    description: "Cambio de divisas cerca del Metro Tobalaba. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-metro-tobalaba",
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

export default async function CasaDeCambioMetroTobalabaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · Metro ", h1Accent: "Tobalaba", heroDesc: "A pocas cuadras del Metro Tobalaba, en Av. Pedro de Valdivia 020, Providencia. Compra y venta de divisas sin comisiones, 38 años de experiencia.", articleHeading: "¿Dónde cambiar dinero cerca del Metro Tobalaba?", articleText: "El Metro Tobalaba, donde se conectan las Líneas 1 y 4, es uno de los intercambiadores más movidos de Santiago, en el límite entre Providencia y Las Condes y junto a Costanera Center. Miles de personas pasan por ahí a diario y muchas necesitan cambiar divisas de paso. Si estás en Tobalaba y quieres una casa de cambio con precio del día y sin comisiones, Gamaex queda a muy pocas estaciones.\n\nEl viaje es breve y sin combinaciones. Toma la Línea 1 en Tobalaba en dirección al poniente y baja en Pedro de Valdivia, pasando solo por Los Leones. En un par de minutos estás en la oficina, que queda a pasos de la salida oriente del metro. Si prefieres, puedes caminar por Av. Providencia rumbo al centro y llegar a la altura de Pedro de Valdivia en un paseo cómodo y plano.\n\nGamaex funciona desde 1988 en Av. Pedro de Valdivia 020 como casa de cambio familiar y presencial. Trabaja más de 40 divisas, publica el precio del día y no aplica comisiones; la calculadora y la tabla de tasas en vivo están en esta página. La atención es sin reserva. Para montos altos se pide cédula según la UAF y puedes confirmar los billetes por WhatsApp antes de llegar. No es banco: la operación se hace al momento." }} />
    </>
  );
}
