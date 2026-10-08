import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Precio Euro Hoy Providencia", item: "https://www.gamaex.cl/precio-euro-hoy-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Precio Euro Hoy en Providencia · EUR/CLP",
  description:
    "Precio del euro hoy en Providencia. Gamaex en Av. Pedro de Valdivia 020 actualiza el EUR/CLP diariamente. Sin comisiones, atención directa.",
  keywords: [
    "precio euro hoy providencia",
    "cotizacion euro providencia",
    "tipo de cambio euro providencia",
    "euro hoy providencia santiago",
    "EUR CLP providencia hoy",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/precio-euro-hoy-providencia",
  },
  openGraph: {
    title: "Precio Euro Hoy Providencia | Gamaex",
    description: "Cotización EUR/CLP actualizada en Gamaex Providencia. Sin comisiones.",
    url: "https://www.gamaex.cl/precio-euro-hoy-providencia",
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

export default async function PrecioEuroHoyProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Precio del euro hoy en ", h1Accent: "Providencia", heroDesc: "EUR/CLP actualizado hoy en Gamaex Providencia. Consulta el precio del euro y cambia tus divisas sin comisiones.", articleHeading: "¿Cuál es el precio del euro hoy en Providencia?", articleText: "El precio del euro se define cada día según los mercados, así que en Providencia, como en el resto de Chile, la referencia útil es la del día en curso. Si vives, trabajas o pasas por la comuna, tener cerca un lugar donde el valor esté publicado facilita cambiar euros sin dar vueltas. Lo importante es consultar el precio actualizado antes de operar y no guiarte por una cifra vieja.\n\nEn Gamaex publicamos el precio del euro del día y lo actualizamos a diario. Puedes verlo en la tabla de esta página y estimar tu operación con la calculadora antes de salir de tu casa u oficina. Trabajamos sin comisiones ni cargos ocultos, así que el valor publicado es el que aplicamos en el mostrador, tanto si vienes a comprar euros como a venderlos. Para un monto alto, escríbenos por WhatsApp y confirmamos disponibilidad de billetes.\n\nEstamos en pleno Providencia, en Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia de la Línea 1, con atención presencial desde 1988 y sin reserva previa. Para operaciones de mayor volumen pedimos tu cédula de identidad y las registramos según la normativa de la UAF. No somos banco: consultas el precio del día y cambias tus euros al instante, en efectivo y sin abrir cuenta." }} />
    </>
  );
}
