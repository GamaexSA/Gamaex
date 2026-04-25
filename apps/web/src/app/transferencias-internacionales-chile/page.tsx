import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Transferencias Internacionales Chile", item: "https://www.gamaex.cl/transferencias-internacionales-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Transferencias Internacionales en Chile | Gamaex — Providencia",
  description:
    "Gamaex ofrece transferencias internacionales y pagos a proveedores en moneda extranjera desde Providencia. 38 años de experiencia, condiciones especiales para empresas y personas.",
  keywords: [
    "transferencias internacionales chile",
    "transferencia internacional desde chile",
    "enviar dinero al exterior chile",
    "pago proveedores moneda extranjera chile",
    "transferencia internacional providencia",
    "remesas internacionales santiago",
    "enviar euros desde chile",
    "enviar dolares desde chile",
    "transferencia swift chile",
    "gamaex transferencias internacionales",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/transferencias-internacionales-chile",
  },
  openGraph: {
    title: "Transferencias Internacionales en Chile | Gamaex",
    description:
      "Envíos y pagos al exterior desde Providencia. 38 años de trayectoria. Condiciones especiales para empresas.",
    url: "https://www.gamaex.cl/transferencias-internacionales-chile",
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

export default async function TransferenciasInternacionalesPage() {
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
