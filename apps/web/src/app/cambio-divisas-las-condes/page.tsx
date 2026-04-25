import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Divisas Las Condes", item: "https://www.gamaex.cl/cambio-divisas-las-condes" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio de Divisas Las Condes | Gamaex — USD EUR y más",
  description:
    "Cambio de divisas cercano a Las Condes. Gamaex en Av. Pedro de Valdivia 020, Providencia — a minutos de Las Condes. Más de 40 monedas, sin comisiones, 38 años.",
  keywords: [
    "cambio divisas las condes",
    "casa de cambio las condes providencia",
    "comprar dolares las condes santiago",
    "donde cambiar moneda las condes",
    "divisas las condes santiago",
    "cambio moneda extranjera las condes",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-divisas-las-condes",
  },
  openGraph: {
    title: "Cambio Divisas Las Condes | Gamaex Providencia",
    description: "Cambio de divisas cercano a Las Condes. Gamaex en Providencia, sin comisiones.",
    url: "https://www.gamaex.cl/cambio-divisas-las-condes",
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

export default async function CambioDivisasLasCondesPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambio de divisas · ", h1Accent: "Las Condes", heroDesc: "Cambio de divisas cercano a Las Condes. Gamaex en Av. Pedro de Valdivia 020, Providencia — USD, EUR y +40 monedas sin comisiones." }} />
    </>
  );
}
