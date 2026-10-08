import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Divisas Santiago Centro", item: "https://www.gamaex.cl/cambio-divisas-santiago-centro" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Divisas Santiago Centro · +40 Monedas",
  description:
    "Cambia divisas en Santiago. Gamaex en Av. Pedro de Valdivia 020, Providencia. Más de 40 monedas, sin comisiones, 38 años de experiencia.",
  keywords: [
    "cambio divisas santiago centro",
    "casa de cambio santiago",
    "comprar dolares santiago centro",
    "donde cambiar moneda santiago",
    "divisas santiago chile",
    "cambio moneda extranjera santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-divisas-santiago-centro",
  },
  openGraph: {
    title: "Cambio Divisas Santiago | Gamaex Providencia",
    description: "Cambio de divisas en Santiago. Gamaex en Providencia, más de 40 monedas, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-divisas-santiago-centro",
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

export default async function CambioDivisasSantiagoCentroPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de divisas en ", h1Accent: "Santiago", heroDesc: "Cambio de divisas en Santiago con más de 40 monedas. Gamaex en Providencia — la referencia de casas de cambio en la ciudad.", articleHeading: "¿Dónde cambiar divisas cerca de Santiago Centro?", articleText: "Santiago Centro es zona de bancos, comercio y trámites, y muchas personas que trabajan o pasan por el centro necesitan cambiar divisas en el día. Entre la Alameda, la Bolsa y el barrio cívico abundan las opciones, pero no siempre es fácil encontrar precio publicado y atención rápida. Si prefieres una casa de cambio con trayectoria y tasas a la vista, Gamaex en Providencia está a un corto viaje del centro.\n\nDesde Santiago Centro llegas fácil en Metro: toma la Línea 1 en estaciones como Universidad de Chile, Santa Lucía o Baquedano en dirección al oriente y baja en Pedro de Valdivia. Son pocas estaciones y, con la salida oriente, quedas a metros de la oficina. Si vienes caminando o en bici por Av. Providencia, es un trayecto directo y bien conectado desde el centro hacia el sector de Providencia.\n\nEn Av. Pedro de Valdivia 020, Gamaex atiende desde 1988 como empresa familiar y presencial. Maneja más de 40 divisas, muestra el precio del día y no cobra comisiones; en esta misma página tienes calculadora y tabla de tasas actualizada. No necesitas reservar hora. Para montos altos se solicita cédula según la normativa UAF, y puedes confirmar disponibilidad de billetes por WhatsApp. Al no ser banco, resolvemos la operación al momento." }} />
    </>
  );
}
