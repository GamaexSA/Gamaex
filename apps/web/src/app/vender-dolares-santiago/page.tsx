import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Vender Dólares en Santiago", item: "https://www.gamaex.cl/vender-dolares-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Vender Dólares en Santiago · Mejor Precio",
  description:
    "Vende tus dólares al mejor precio en Gamaex, Providencia. 38 años comprando divisas a precios justos, a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "vender dolares santiago",
    "donde vender dolares en santiago",
    "vender dolares providencia",
    "vender USD chile",
    "vender divisas santiago",
    "mejor precio para vender dolares santiago",
    "cambio dolar venta providencia",
    "vender dolares en efectivo santiago",
    "cuanto me dan por mis dolares santiago",
    "vender dolares metro pedro de valdivia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/vender-dolares-santiago",
  },
  openGraph: {
    title: "Vender Dólares en Santiago | Gamaex Chile — Mejor Precio",
    description:
      "38 años comprando divisas en Providencia. Precios justos, sin comisiones. Metro Pedro de Valdivia.",
    url: "https://www.gamaex.cl/vender-dolares-santiago",
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

export default async function VenderDolaresSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Vender dólares en ", h1Accent: "Santiago", heroDesc: "El mejor lugar para vender dólares en Santiago. Gamaex en Providencia — pago inmediato, sin comisiones.", articleHeading: "¿Dónde vender dólares en Santiago?", articleText: "Si tienes dólares en efectivo y quieres cambiarlos a pesos chilenos, en Gamaex los compramos al precio publicado del día, sin comisiones. Estamos en Av. Pedro de Valdivia 020, Providencia, con 38 años de trayectoria y reseñas verificables en Google. El valor que recibes corresponde al precio de compra del dólar que aparece en la tabla de tasas de esta página, actualizado a diario.\n\nAceptamos billetes en buen estado; los dólares muy deteriorados o fuera de circulación quedan sujetos a evaluación en el momento. Para vender necesitas tu cédula de identidad, y en operaciones de monto alto la transacción se registra según la normativa de la UAF. El pago es inmediato, sin abrir cuentas ni esperar transferencias.\n\nVender en una casa de cambio en lugar de un banco conviene cuando buscas rapidez y un precio transparente por efectivo, por ejemplo con dólares que te sobraron de un viaje. Si tienes un monto grande, consúltanos antes por WhatsApp para confirmar el precio y coordinar la atención." }} />
    </>
  );
}
