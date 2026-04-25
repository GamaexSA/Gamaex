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
  title: "Casa de Cambio Metro Irarrázaval | Gamaex Providencia",
  description:
    "Casa de cambio cerca del Metro Irarrázaval. Gamaex en Av. Pedro de Valdivia 020, Providencia — a pocas cuadras de Irarrázaval. Sin comisiones, 38 años de trayectoria.",
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
    title: "Casa de Cambio Metro Irarrázaval | Gamaex Providencia",
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
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Casa de cambio · Metro ", h1Accent: "Irarrázaval", heroDesc: "A pocas cuadras del Metro Irarrázaval, en Av. Pedro de Valdivia 020, Providencia. Divisas sin comisiones, 38 años de experiencia." }} />
    </>
  );
}
