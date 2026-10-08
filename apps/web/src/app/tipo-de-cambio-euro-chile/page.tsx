import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Tipo de Cambio Euro Chile", item: "https://www.gamaex.cl/tipo-de-cambio-euro-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Tipo de Cambio Euro Chile Hoy · EUR/CLP",
  description:
    "Consulta el tipo de cambio del euro en Chile hoy. Gamaex actualiza el EUR/CLP a diario. Cambia euros en Providencia sin comisiones, 38 años de experiencia.",
  keywords: [
    "tipo de cambio euro chile",
    "tipo de cambio euro hoy chile",
    "EUR CLP hoy",
    "cotizacion euro chile hoy",
    "precio euro chile",
    "euro pesos chilenos hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/tipo-de-cambio-euro-chile",
  },
  openGraph: {
    title: "Tipo de Cambio Euro Chile Hoy | Gamaex",
    description: "EUR/CLP actualizado hoy. Cambia euros en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/tipo-de-cambio-euro-chile",
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

export default async function TipoDeCambioEuroChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Tipo de cambio del ", h1Accent: "euro en Chile", heroDesc: "Tipo de cambio EUR/CLP actualizado hoy en Chile. Cambia tus euros en Gamaex Providencia sin comisiones.", articleHeading: "¿Qué es el tipo de cambio del euro y cómo se aplica en Chile?", articleText: "El tipo de cambio del euro es la relación entre esa moneda y el peso chileno: cuántos pesos equivalen a un euro en un momento dado. Ese valor se mueve a diario según los mercados internacionales, por lo que en una casa de cambio suele haber un precio para comprar y otro para vender. Entender esta diferencia te ayuda a saber qué esperar según si traes euros o los necesitas para viajar.\n\nEn Gamaex aplicamos el tipo de cambio del euro del día, actualizado a diario, sin comisiones ni cargos ocultos. Puedes consultar la tasa vigente en la tabla de esta página y usar la calculadora para ver el equivalente en pesos antes de venir, ya sea que vayas a comprar o a vender. Así llegas con las cuentas claras. Si el monto es alto, escríbenos por WhatsApp para confirmar disponibilidad de billetes y coordinar tu atención.\n\nNos ubicamos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1, con atención presencial desde 1988 y sin reserva previa. Para operaciones de mayor volumen pedimos tu cédula de identidad y las registramos según la normativa de la UAF. No somos banco: no hace falta abrir cuenta y el cambio de tus euros se concreta al instante, en efectivo." }} />
    </>
  );
}
