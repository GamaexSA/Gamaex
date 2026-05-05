import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | Gamaex Chile",
  description:
    "Resolvemos las dudas más comunes sobre cambio de divisas en Gamaex: monedas que trabajamos, horarios, comisiones, billetes aceptados y transferencias internacionales.",
  alternates: { canonical: "https://www.gamaex.cl/preguntas-frecuentes" },
  openGraph: {
    title: "Preguntas frecuentes | Gamaex Chile",
    description: "Lo que más nos preguntan sobre cambio de divisas, horarios, comisiones y transferencias.",
    url: "https://www.gamaex.cl/preguntas-frecuentes",
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

export default async function FaqPage() {
  const data = await getRates();
  return (
    <LandingPage
      variant="faq"
      rates={data.rates}
      systemStatus={data.system_status}
      lastSyncAt={data.last_sync_at}
    />
  );
}
