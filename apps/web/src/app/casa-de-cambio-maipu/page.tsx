import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio Maipú", item: "https://www.gamaex.cl/casa-de-cambio-maipu" },
  ],
});

export const metadata: Metadata = {
  title: "Casa de Cambio Maipú | Gamaex — Divisas en Santiago",
  description:
    "Casa de cambio cercana a Maipú. Gamaex en Av. Pedro de Valdivia 020, Providencia — accesible desde Maipú en Metro Línea 1 o Línea 5. Sin comisiones, 38 años.",
  keywords: [
    "casa de cambio maipu",
    "cambio divisas maipu santiago",
    "comprar dolares maipu",
    "donde cambiar moneda maipu",
    "divisas maipu santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-maipu",
  },
  openGraph: {
    title: "Casa de Cambio Maipú | Gamaex Santiago",
    description: "Cambio de divisas accesible desde Maipú. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/casa-de-cambio-maipu",
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

export default async function CasaDeCambioMaipuPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio para clientes de ", h1Accent: "Maipú", heroDesc: "Gamaex en Av. Pedro de Valdivia 020, Providencia — accesible desde Maipú en Metro. Sin comisiones, +40 divisas, 38 años de experiencia.", articleText: "Desde Maipú, Gamaex es accesible en Metro Línea 5 hasta Baquedano, donde puedes hacer combinación con Línea 1 hasta Pedro de Valdivia. El local está en Av. Pedro de Valdivia 020, a pasos de la salida del metro. El viaje desde Maipú toma aproximadamente 40 minutos en metro." }} />
    </>
  );
}
