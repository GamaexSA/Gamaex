import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Cambiar Reales a Pesos Chilenos", item: "https://www.gamaex.cl/cambiar-reales-a-pesos-chilenos" },
  ],
});

export const metadata: Metadata = {
  title: "Cambiar Reales a Pesos Chilenos · BRL/CLP",
  description:
    "Cambia reales brasileños a pesos chilenos en Gamaex, Providencia. Precio BRL/CLP actualizado, sin comisiones. 38 años de experiencia en Santiago.",
  keywords: [
    "cambiar reales a pesos chilenos",
    "BRL a CLP",
    "real brasileno a peso chileno",
    "cambio real chileno",
    "precio real brasileno chile hoy",
    "cuantos pesos son un real brasileno",
    "cambiar BRL a CLP santiago",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/cambiar-reales-a-pesos-chilenos",
  },
  openGraph: {
    title: "Cambiar Reales a Pesos Chilenos | BRL→CLP — Gamaex",
    description: "Cambia reales a pesos chilenos en Gamaex Providencia. Precio justo, sin comisiones.",
    url: "https://www.gamaex.cl/cambiar-reales-a-pesos-chilenos",
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

export default async function CambiarRealesAPesosChilenosPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Cambiar reales a ", h1Accent: "pesos chilenos", heroDesc: "Cambia reales brasileños a pesos chilenos en Gamaex, Providencia. Cotización BRL/CLP actualizada, sin comisiones, atención directa.", articleHeading: "¿Cómo cambiar reales a pesos chilenos correctamente?", articleText: "Cambiar reales brasileños a pesos chilenos es un trámite frecuente entre quienes vuelven de Brasil con billetes de sobra o reciben reales por trabajo y comercio con ese país. Lo que define cuántos pesos recibes es el tipo de cambio del día entre el real y el peso, un valor que se mueve con los mercados y que conviene consultar actualizado justo antes de operar, no con una cifra antigua.\n\nEn Gamaex trabajamos con el precio del día para el real, sin comisiones ni cargos ocultos, así que el monto que ves es el que se te entrega. Puedes calcular tu operación con la calculadora de esta página: ingresas los reales y te muestra el equivalente en pesos con la tasa vigente, que actualizamos a diario y se refleja en la tabla en vivo. Si traes un monto importante, escríbenos por WhatsApp para confirmar disponibilidad y atención sin espera.\n\nNos ubicamos en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia de la Línea 1. Somos una casa de cambio familiar que atiende presencialmente desde 1988, sin reserva previa. Para operaciones de mayor volumen pedimos tu cédula de identidad y las registramos conforme a la normativa de la UAF. No somos banco: recibes tus pesos en efectivo al instante, sin cuentas ni esperas." }} />
    </>
  );
}
