import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio El Bosque", item: "https://www.gamaex.cl/casa-de-cambio-el-bosque" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Av. El Bosque",
  description:
    "Cambio de divisas cerca de Av. El Bosque (Las Condes). Gamaex atiende en Av. Pedro de Valdivia 020, Providencia. Más de 40 divisas, sin comisiones.",
  keywords: [
    "casa de cambio el bosque",
    "cambio divisas el bosque santiago",
    "comprar dolares el bosque las condes",
    "casa de cambio cercana el bosque",
    "divisas el bosque santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-el-bosque",
  },
  openGraph: {
    title: "Casa de cambio cerca de Av. El Bosque — Gamaex Providencia",
    description: "Cambio de divisas cercano a El Bosque. Gamaex en Providencia, 38 años.",
    url: "https://www.gamaex.cl/casa-de-cambio-el-bosque",
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

export default async function CasaDeCambioElBosquePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ articleHeading: "¿Dónde cambiar dinero cerca de Av. El Bosque, El Golf?", articleText: "El Golf, en torno a Av. El Bosque y la calle Isidora Goyenechea, es uno de los polos financieros y hoteleros de Santiago. Ejecutivos, turistas y profesionales que se mueven por el barrio suelen necesitar cambiar dólares u otras divisas entre reuniones. En vez de recorrer varias oficinas, muchos prefieren una casa de cambio con precio claro y sin comisiones; Gamaex, en Providencia, queda muy cerca de este sector.\n\nDesde Av. El Bosque el camino es corto. En Metro, entra por la estación El Golf de la Línea 1 y viaja al poniente hasta Pedro de Valdivia, apenas un par de estaciones. A pie o en auto, baja por Av. Apoquindo hacia Av. Providencia y continúa hasta la altura de Pedro de Valdivia. La salida oriente del metro te deja prácticamente frente a la oficina.\n\nGamaex opera desde 1988 en Av. Pedro de Valdivia 020 como casa de cambio familiar y presencial. Trabaja más de 40 divisas, publica el precio del día y no aplica comisiones; la calculadora y la tabla de tasas en vivo están en esta página. La atención es sin reserva. Para montos altos se pide cédula por normativa UAF y puedes escribir por WhatsApp para confirmar los billetes que necesitas. No somos banco: la operación es inmediata." }} />
    </>
  );
}
