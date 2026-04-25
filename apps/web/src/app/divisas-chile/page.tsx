import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Divisas Chile", item: "https://www.gamaex.cl/divisas-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Divisas en Chile | Compra y Venta de Moneda Extranjera — Gamaex",
  description:
    "Compra y venta de divisas en Chile. Gamaex en Providencia ofrece más de 40 monedas extranjeras al mejor precio — sin comisiones, 38 años de trayectoria.",
  keywords: [
    "divisas chile",
    "compra venta divisas chile",
    "moneda extranjera chile",
    "donde comprar divisas chile",
    "divisas santiago chile",
    "cambio divisas chile precio",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/divisas-chile",
  },
  openGraph: {
    title: "Divisas en Chile | Gamaex Providencia",
    description: "+40 divisas en Gamaex Chile. Compra y venta sin comisiones en Providencia.",
    url: "https://www.gamaex.cl/divisas-chile",
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

export default async function DivisasChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Divisas en ", h1Accent: "Chile", heroDesc: "Compra y venta de más de 40 divisas en Gamaex, Providencia. USD, EUR, BRL, GBP, JPY y más — precios del día, sin comisiones, 38 años." }} />
    </>
  );
}
