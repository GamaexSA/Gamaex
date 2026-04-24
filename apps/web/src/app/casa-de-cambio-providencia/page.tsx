import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Casa de Cambio en Providencia | Gamaex — Av. Pedro de Valdivia 020",
  description:
    "Gamaex: la casa de cambio de referencia en Providencia con 38 años de trayectoria. Compra y venta de +40 divisas en Av. Pedro de Valdivia 020, a metros del Metro Pedro de Valdivia. Sin comisiones ocultas.",
  keywords: [
    "casa de cambio providencia",
    "casa de cambio pedro de valdivia",
    "cambio moneda providencia",
    "donde cambiar moneda providencia",
    "casa de cambio cerca de mí providencia",
    "cambio divisas providencia santiago",
    "mejor casa de cambio providencia",
    "gamaex chile providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/casa-de-cambio-providencia",
  },
  openGraph: {
    title: "Casa de Cambio en Providencia | Gamaex Chile",
    description:
      "38 años de trayectoria en Providencia. +40 divisas, precios finales, sin comisiones. Av. Pedro de Valdivia 020.",
    url: "https://www.gamaex.cl/casa-de-cambio-providencia",
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

export default async function CasaDeCambioPage() {
  const data = await getRates();
  return (
    <LandingPage
      rates={data.rates}
      systemStatus={data.system_status}
      lastSyncAt={data.last_sync_at}
    />
  );
}
