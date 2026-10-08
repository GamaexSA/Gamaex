import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Metro Manuel Montt", item: "https://www.gamaex.cl/casa-de-cambio-metro-manuel-montt" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio cerca de Metro Manuel Montt",
  description:
    "Casa de cambio cerca de Metro Manuel Montt. Gamaex en Av. Pedro de Valdivia 020, Providencia, a pocas cuadras. Sin comisiones, 38 años de trayectoria.",
  keywords: [
    "casa de cambio metro manuel montt",
    "cambio divisas manuel montt providencia",
    "comprar dolares metro manuel montt",
    "casa de cambio cerca manuel montt",
    "divisas manuel montt providencia",
    "cambio moneda manuel montt santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-metro-manuel-montt",
  },
  openGraph: {
    title: "Casa de Cambio cerca de Metro Manuel Montt | Gamaex",
    description: "Cambio de divisas cerca de Metro Manuel Montt. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-metro-manuel-montt",
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

export default async function CasaDeCambioMetroManuelMonttPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · Metro ", h1Accent: "Manuel Montt", heroDesc: "A pocas cuadras del Metro Manuel Montt, en Av. Pedro de Valdivia 020, Providencia. Cambia dólares, euros, reales y más de 40 divisas sin comisiones.", articleHeading: "¿Dónde cambiar dinero cerca del Metro Manuel Montt?", articleText: "El Metro Manuel Montt, sobre Av. Providencia, está en pleno corazón de la comuna, rodeado de oficinas, restoranes y vida de barrio. Quienes se mueven por ahí a menudo necesitan cambiar divisas sin alejarse de su rutina. La buena noticia es que Gamaex está a solo una estación de distancia, con precio del día publicado y sin comisiones, así que no tienes que buscar mucho para encontrar una casa de cambio confiable.\n\nEl trayecto no puede ser más corto. Desde Manuel Montt toma la Línea 1 hacia el oriente y baja en la siguiente estación, Pedro de Valdivia; usando la salida oriente quedas prácticamente en la puerta. Si prefieres caminar, basta con seguir por Av. Providencia unas cuadras en dirección al oriente para llegar a la altura de Pedro de Valdivia. Es uno de los accesos más simples de todo el sector.\n\nGamaex funciona desde 1988 en Av. Pedro de Valdivia 020 como empresa familiar y de trato presencial. Ofrece más de 40 divisas, muestra el precio del día y no cobra comisiones; la calculadora y la tabla de tasas en vivo están aquí mismo. La atención es sin reserva. Para montos altos se pide cédula según la UAF y puedes confirmar billetes por WhatsApp antes de venir. No es banco: la operación se resuelve al instante." }} />
    </>
  );
}
