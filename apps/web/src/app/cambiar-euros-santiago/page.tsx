import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Euros en Santiago", item: "https://www.gamaex.cl/cambiar-euros-santiago" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Euros en Santiago · EUR/CLP Hoy",
  description:
    "Cambia euros a pesos chilenos en Gamaex, Providencia. 38 años de trayectoria, sin comisiones, a pasos del Metro Pedro de Valdivia.",
  keywords: [
    "cambiar euros santiago",
    "cambio euro peso chileno",
    "EUR CLP providencia",
    "comprar euros santiago",
    "vender euros santiago",
    "casa de cambio euro santiago",
    "cambio euros providencia",
    "donde cambiar euros en santiago",
    "precio euro hoy santiago chile",
    "cambio euro a pesos chilenos",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-euros-santiago",
  },
  openGraph: {
    title: "Cambiar Euros en Santiago | Gamaex Chile — EUR/CLP",
    description:
      "Compra y venta de euros en Providencia. 38 años de trayectoria. Precios transparentes, sin comisiones.",
    url: "https://www.gamaex.cl/cambiar-euros-santiago",
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

export default async function CambiarEurosSantiagoPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar euros en ", h1Accent: "Santiago", heroDesc: "Cambia euros en Santiago al mejor precio. Gamaex en Providencia — cotización EUR/CLP actualizada diariamente, sin comisiones.", articleHeading: "¿Dónde cambiar euros en Santiago de forma segura?", articleText: "Santiago recibe cada semana a viajeros que regresan de Europa y a residentes que reciben euros por trabajo, familia o pagos desde el exterior. A la hora de cambiarlos, muchos dudan entre hacerlo en un lugar establecido o con alguien en la calle. La diferencia es simple: en una casa de cambio con dirección fija ves el precio publicado antes de cerrar la operación, cuentas los billetes con calma y todo queda respaldado.\n\nEn Gamaex atendemos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1, un punto céntrico y fácil de llegar en transporte público. Cambiamos euros al valor del día, sin comisiones ni descuentos escondidos, y puedes revisar la tasa vigente en la tabla y la calculadora de esta misma página antes de moverte de tu casa.\n\nOperamos desde 1988 como negocio familiar, con atención presencial y sin necesidad de reservar. Si vas a cambiar un monto alto, conviene escribirnos por WhatsApp para confirmar que tenemos los billetes que buscas; también así evitas esperas. Recuerda traer tu cédula de identidad: para operaciones de mayor volumen la registramos conforme a la normativa de la UAF. No trabajamos como banco, así que la operación es inmediata y no hay que abrir ninguna cuenta para cambiar tus euros." }} />
    </>
  );
}
