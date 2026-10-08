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
  title: "Cambiar Dólares en Providencia · USD/CLP Hoy",
  description:
    "Cambia dólares en Providencia con 38 años de trayectoria. Compra y venta de USD sin comisiones, a pasos del Metro Pedro de Valdivia.",
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
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar dólares en ", h1Accent: "Providencia", heroDesc: "Cambia tus dólares en Providencia al mejor precio. Gamaex en Av. Pedro de Valdivia 020 — sin comisiones, cotización diaria, atención directa.", articleHeading: "¿Dónde cambiar dólares en Providencia?", articleText: "Cambiar dólares en Providencia es una gestión frecuente: la comuna reúne oficinas, comercio y viajeros que llegan o vuelven del extranjero. Ya sea que necesites convertir dólares a pesos o comprar dólares para un viaje, conviene ir a una casa de cambio con precio del día claro y sin comisiones. Gamaex, en Av. Pedro de Valdivia 020, atiende justamente ese tipo de operaciones de forma presencial e inmediata.\n\nLa oficina está muy bien conectada. Queda a pasos del Metro Pedro de Valdivia, en la Línea 1, así que desde el centro, Baquedano, Manuel Montt, Los Leones o Tobalaba llegas en pocos minutos. Con la salida oriente del metro quedas casi frente a la entrada. Si te mueves por Av. Providencia caminando o en bici, también es un punto fácil de ubicar dentro del eje principal de la comuna.\n\nAdemás del dólar, Gamaex trabaja más de 40 divisas y publica sus tasas en vivo, con calculadora en esta misma página para estimar tu cambio antes de venir. Opera desde 1988 como empresa familiar, sin comisiones y sin reserva de hora. Para montos altos se solicita cédula por normativa UAF y puedes confirmar los billetes por WhatsApp. Al no ser banco, el cambio de dólares se hace al momento en el mostrador." }} />
    </>
  );
}
