import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Dólares en Providencia", item: "https://www.gamaex.cl/cambiar-dolares-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Dólares en Providencia | Gamaex Chile — Metro Pedro de Valdivia",
  description:
    "Cambiá dólares en Providencia con 38 años de trayectoria. Gamaex: compra y venta de USD al mejor precio, a pasos del Metro Pedro de Valdivia. Sin comisiones. Cotizá por WhatsApp.",
  keywords: [
    "cambiar dólares providencia",
    "comprar dólares providencia",
    "vender dólares providencia",
    "cambio dólar santiago",
    "USD CLP providencia",
    "casa de cambio metro pedro de valdivia",
    "dólar a peso chileno providencia",
    "cambio dólar hoy santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-dolares-providencia",
  },
  openGraph: {
    title: "Cambiar Dólares en Providencia | Gamaex Chile",
    description:
      "38 años cambiando dólares en Providencia. Sin comisiones, precios finales. Metro Pedro de Valdivia.",
    url: "https://www.gamaex.cl/cambiar-dolares-providencia",
  },
};

async function getRates(): Promise<PublicRatesResponse> {
  const empty: PublicRatesResponse = {
    rates: [],
    system_status: "stale",
    last_sync_at: "",
    cache_ttl_seconds: 60,
  };
  try {
    const url = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/rates/public`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return res.json() as Promise<PublicRatesResponse>;
  } catch {
    return empty;
  }
}

export default async function CambiarDolaresPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage
        rates={data.rates}
        systemStatus={data.system_status}
        lastSyncAt={data.last_sync_at}
      />
    </>
  );
}
