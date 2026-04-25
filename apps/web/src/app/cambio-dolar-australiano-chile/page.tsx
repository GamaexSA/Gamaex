import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambio Dólar Australiano Chile", item: "https://www.gamaex.cl/cambio-dolar-australiano-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Cambio Dólar Australiano en Chile | AUD/CLP — Gamaex Providencia",
  description:
    "Compra y vende dólares australianos en Gamaex, Providencia. Precio AUD/CLP actualizado, sin comisiones. 38 años de experiencia en cambio de divisas.",
  keywords: [
    "cambio dolar australiano chile",
    "comprar dolares australianos santiago",
    "vender dolares australianos chile",
    "AUD CLP precio hoy",
    "tipo de cambio dolar australiano chile",
    "cotizacion dolar australiano santiago",
    "casa de cambio dolar australiano",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambio-dolar-australiano-chile",
  },
  openGraph: {
    title: "Cambio Dólar Australiano Chile | AUD/CLP — Gamaex",
    description: "Precio AUD/CLP actualizado. Compra y venta de dólares australianos en Gamaex Providencia.",
    url: "https://www.gamaex.cl/cambio-dolar-australiano-chile",
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

export default async function CambioDolarAustralianPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />
    </>
  );
}
