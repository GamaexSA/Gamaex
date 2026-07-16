import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const URL = "https://www.gamaex.cl/casa-de-cambio/providencia";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Casa de Cambio", item: "https://www.gamaex.cl/casa-de-cambio" },
    { "@type": "ListItem", position: 3, name: "Providencia", item: URL },
  ],
});

const localBusiness = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Gamaex Chile",
  url: "https://www.gamaex.cl",
  image: "https://www.gamaex.cl/opengraph-image",
  telephone: "+56229462670",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Pedro de Valdivia 020",
    addressLocality: "Providencia",
    addressRegion: "Región Metropolitana",
    postalCode: "7500000",
    addressCountry: "CL",
  },
  areaServed: ["Providencia", "Las Condes", "Santiago", "Región Metropolitana"],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "13:00" },
  ],
  sameAs: ["https://www.gamaex.cl/"],
});

export const metadata: Metadata = {
  // Sin sufijo " | Gamaex Chile" — el layout.tsx lo agrega vía title.template.
  title: "Casa de Cambio en Providencia · +40 Divisas",
  description:
    "Compra y venta de dólares, euros y +40 divisas en Providencia. Sin comisiones, en Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "casa de cambio providencia",
    "casa de cambio en providencia",
    "money exchange providencia",
    "currency exchange providencia",
    "cambio de divisas providencia",
    "comprar dolares providencia",
    "vender dolares providencia",
    "gamaex providencia",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Casa de Cambio en Providencia | Gamaex Chile",
    description:
      "Compra y venta de dólares, euros, reales y más de 40 divisas en Gamaex Chile. Av. Pedro de Valdivia 020, Providencia.",
    url: URL,
  },
};

async function getRates(): Promise<PublicRatesResponse> {
  const empty: PublicRatesResponse = { rates: [], system_status: "stale", last_sync_at: "", cache_ttl_seconds: 60 };
  try {
    const apiUrl = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/rates/public`;
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return res.json() as Promise<PublicRatesResponse>;
  } catch {
    return empty;
  }
}

export default async function CasaDeCambioProvidenciaPage(): Promise<JSX.Element> {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localBusiness }} />
      <LandingPage
        rates={data.rates}
        systemStatus={data.system_status}
        lastSyncAt={data.last_sync_at}
        pageContext={{
          h1Before: "Casa de cambio en ",
          h1Accent: "Providencia",
          heroDesc:
            "Compra y venta de dólares, euros, reales y más de 40 divisas en Gamaex Chile. Atención presencial en Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia. Sin app, sin registro, sin comisiones ocultas.",
        }}
      />
    </>
  );
}
