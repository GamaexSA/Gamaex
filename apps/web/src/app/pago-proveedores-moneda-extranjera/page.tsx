import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Pago a Proveedores Moneda Extranjera", item: "https://www.gamaex.cl/pago-proveedores-moneda-extranjera" },
  ],
});

export const metadata: Metadata = {
  title: "Pago a Proveedores en Moneda Extranjera | Gamaex Chile",
  description:
    "Paga a tus proveedores en moneda extranjera con Gamaex. Transferencias internacionales en USD, EUR y más. Condiciones especiales para empresas. 38 años de experiencia.",
  keywords: [
    "pago proveedores moneda extranjera chile",
    "transferencia internacional proveedores chile",
    "pagar en dolares a proveedores",
    "pago en divisas empresas chile",
    "transferir dolares proveedores santiago",
    "cambio divisas empresas chile",
    "pago internacional chile",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/pago-proveedores-moneda-extranjera",
  },
  openGraph: {
    title: "Pago a Proveedores Moneda Extranjera | Gamaex Chile",
    description: "Transferencias internacionales y pago a proveedores en divisas. Condiciones para empresas.",
    url: "https://www.gamaex.cl/pago-proveedores-moneda-extranjera",
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

export default async function PagoProveedoresPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Pago a proveedores en ", h1Accent: "moneda extranjera", heroDesc: "Paga a tus proveedores en moneda extranjera con Gamaex. Condiciones especiales para empresas, transferencias internacionales y divisas." }} />
    </>
  );
}
