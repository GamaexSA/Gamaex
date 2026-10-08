import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Metro Irarrázaval", item: "https://www.gamaex.cl/casa-de-cambio-metro-irarrazaval" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Metro Irarrázaval",
  description:
    "Casa de cambio cerca del Metro Irarrázaval. Gamaex en Av. Pedro de Valdivia 020, Providencia, a pocas cuadras. Sin comisiones, 38 años de trayectoria.",
  keywords: [
    "casa de cambio metro irarrazaval",
    "cambio divisas irarrazaval nunoa",
    "comprar dolares metro irarrazaval",
    "casa de cambio cerca metro irarrazaval",
    "divisas irarrazaval providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-metro-irarrazaval",
  },
  openGraph: {
    title: "Casa de Cambio cerca de Metro Irarrázaval | Gamaex",
    description: "Cambio de divisas cerca del Metro Irarrázaval. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-metro-irarrazaval",
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

export default async function CasaDeCambioMetroIrarrazavalPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · Metro ", h1Accent: "Irarrázaval", heroDesc: "A pocas cuadras del Metro Irarrázaval, en Av. Pedro de Valdivia 020, Providencia. Divisas sin comisiones, 38 años de experiencia.", articleHeading: "¿Dónde cambiar dinero cerca del Metro Irarrázaval?", articleText: "El Metro Irarrázaval, donde se cruzan las Líneas 3 y 5, es un paso obligado para quienes viven o trabajan en Ñuñoa y sus alrededores. Muchos vecinos aprovechan el viaje al centro o al oriente para cambiar divisas de un viaje o de un envío. Si sales desde Irarrázaval y quieres una casa de cambio con tasas a la vista y sin comisiones, Gamaex en Providencia está bien conectado por metro.\n\nEl recorrido es directo. Desde Irarrázaval toma la Línea 5 hacia el poniente hasta Baquedano y ahí combina con la Línea 1 en dirección al oriente hasta Pedro de Valdivia. También puedes usar la Línea 3 y combinar según tu punto de partida. Al llegar, la salida oriente del metro Pedro de Valdivia te deja a pasos de la oficina, sin mayores caminatas ni traslados adicionales.\n\nGamaex opera desde 1988 en Av. Pedro de Valdivia 020, casa de cambio familiar y de atención presencial. Maneja más de 40 divisas, muestra el precio del día y no aplica comisiones; en esta página encuentras calculadora y tabla de tasas actualizada. Se atiende sin reserva. Para montos altos se pide cédula según la normativa UAF y puedes escribir por WhatsApp para confirmar la disponibilidad de billetes. No somos banco: resolvemos la operación de inmediato." }} />
    </>
  );
}
