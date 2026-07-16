import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Alerta de Precio de Divisas por WhatsApp",
  description:
    "Déjanos tu precio objetivo y te avisamos por WhatsApp cuando el mercado se acerque. Alerta gratuita, sin compromiso. Dólar, euro y +40 divisas.",
  alternates: { canonical: "https://www.gamaex.cl/alerta-de-precio" },
  openGraph: {
    title: "Alerta de precio | Gamaex Chile",
    description: "Te avisamos por WhatsApp cuando la tasa se acerque a tu precio objetivo. Sin costo, sin compromiso.",
    url: "https://www.gamaex.cl/alerta-de-precio",
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

export default async function AlertaDePrecioPage() {
  const data = await getRates();
  return (
    <LandingPage
      variant="alerta"
      rates={data.rates}
      systemStatus={data.system_status}
      lastSyncAt={data.last_sync_at}
    />
  );
}
