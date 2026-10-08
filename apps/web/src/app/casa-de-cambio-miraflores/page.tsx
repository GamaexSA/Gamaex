import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Miraflores", item: "https://www.gamaex.cl/casa-de-cambio-miraflores" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Miraflores · Divisas",
  description:
    "Casa de cambio cercana a Miraflores, Providencia. Gamaex en Av. Pedro de Valdivia 020, a pocos pasos. Compra y venta de +40 divisas, 38 años.",
  keywords: [
    "casa de cambio miraflores",
    "cambio divisas miraflores providencia",
    "comprar dolares miraflores santiago",
    "casa de cambio cercana miraflores",
    "divisas miraflores providencia",
    "cambio de moneda miraflores santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-miraflores",
  },
  openGraph: {
    title: "Casa de cambio cerca de Miraflores — Gamaex Providencia",
    description: "Cambio de divisas en Miraflores, Providencia. Gamaex, 38 años de experiencia.",
    url: "https://www.gamaex.cl/casa-de-cambio-miraflores",
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

export default async function CasaDeCambioMirafloresPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · ", h1Accent: "Miraflores", heroDesc: "Casa de cambio cerca de Miraflores. Gamaex en Av. Pedro de Valdivia 020, Providencia — +40 divisas, sin comisiones, 38 años.", articleHeading: "¿Dónde cambiar dinero cerca de Miraflores, en el centro?", articleText: "La calle Miraflores, en pleno Santiago Centro, conecta el sector de la Alameda con Bellas Artes y Lastarria, una zona de oficinas, tribunales y turismo. Quien anda por ahí a menudo necesita cambiar dólares u otras divisas dentro del mismo día. Si prefieres evitar las vueltas del centro y buscar una casa de cambio con precio publicado y sin comisiones, Gamaex en Providencia está a un corto viaje en metro.\n\nDesde Miraflores llegas fácil caminando hasta una estación de la Línea 1, como Universidad Católica o Baquedano, y desde ahí viajas al oriente hasta Pedro de Valdivia. Son pocas estaciones y el recorrido es directo, sin combinaciones. Al bajar, la salida oriente del metro te deja a pasos de la oficina. También puedes seguir por Av. Providencia si prefieres un trayecto a pie más largo pero bien conectado.\n\nGamaex atiende desde 1988 en Av. Pedro de Valdivia 020, como empresa familiar y presencial. Ofrece más de 40 divisas, con el precio del día a la vista y sin comisiones; en esta página tienes calculadora y tabla de tasas en vivo. No necesitas reservar hora. Para montos altos se solicita cédula por normativa UAF y puedes escribir por WhatsApp para confirmar billetes antes de venir. No somos banco: la operación es inmediata." }} />
    </>
  );
}
