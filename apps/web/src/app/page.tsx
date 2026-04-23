import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

async function getRates(): Promise<PublicRatesResponse> {
  const empty: PublicRatesResponse = { rates: [], system_status: "stale", last_sync_at: "", cache_ttl_seconds: 60 };
  try {
    const url = `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/rates/public`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return empty;
    return res.json() as Promise<PublicRatesResponse>;
  } catch {
    return empty;
  }
}

export default async function HomePage() {
  const data = await getRates();

  return (
    <LandingPage
      rates={data.rates}
      systemStatus={data.system_status}
      lastSyncAt={data.last_sync_at}
    />
  );
}
