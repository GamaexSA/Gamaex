import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Metro Santa Isabel", item: "https://www.gamaex.cl/casa-de-cambio-metro-santa-isabel" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Metro Santa Isabel",
  description:
    "Casa de cambio cerca de Metro Santa Isabel. Gamaex en Av. Pedro de Valdivia 020, Providencia, a pocas paradas. Sin comisiones, 38 años de experiencia.",
  keywords: [
    "casa de cambio metro santa isabel",
    "cambio divisas santa isabel providencia",
    "comprar dolares metro santa isabel",
    "casa de cambio cerca santa isabel",
    "divisas santa isabel santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-metro-santa-isabel",
  },
  openGraph: {
    title: "Casa de Cambio cerca de Metro Santa Isabel | Gamaex",
    description: "Cambio de divisas cerca de Metro Santa Isabel. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-metro-santa-isabel",
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

export default async function CasaDeCambioMetroSantaIsabelPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · Metro ", h1Accent: "Santa Isabel", heroDesc: "Casa de cambio cerca del Metro Santa Isabel. Gamaex en Av. Pedro de Valdivia 020, Providencia — divisas sin comisiones.", articleHeading: "¿Dónde cambiar dinero cerca del Metro Santa Isabel?", articleText: "El Metro Santa Isabel, en la Línea 5, es una parada muy usada por quienes viven entre Providencia y Ñuñoa, cerca de barrios residenciales y de Barrio Italia. Es común que los vecinos del sector necesiten cambiar dólares u otras divisas sin trasladarse hasta el centro. Si estás por Santa Isabel y prefieres una casa de cambio con precio del día y sin comisiones, Gamaex queda a un viaje breve.\n\nPara llegar, toma la Línea 5 en Santa Isabel hacia el poniente hasta Baquedano y combina con la Línea 1 en dirección al oriente, bajando en Pedro de Valdivia. Son pocas estaciones en total. Si vas en auto, puedes subir por Av. Salvador o Av. Vicuña Mackenna hacia Providencia y seguir hasta la altura de Pedro de Valdivia. La salida oriente del metro deja la oficina justo al lado.\n\nGamaex atiende desde 1988 en Av. Pedro de Valdivia 020 como casa de cambio familiar y presencial. Trabaja más de 40 divisas, publica el precio del día y opera sin comisiones, con calculadora y tabla de tasas en vivo en esta página. No requiere reserva. Para montos altos se solicita cédula por la normativa UAF, y puedes confirmar los billetes que buscas por WhatsApp. Al no ser banco, la operación es inmediata y presencial." }} />
    </>
  );
}
