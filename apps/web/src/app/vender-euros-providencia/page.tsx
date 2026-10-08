import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Vender Euros Providencia", item: "https://www.gamaex.cl/vender-euros-providencia" },
  ],
});

export const metadata: Metadata = {
  title: "Vender Euros en Providencia · EUR Hoy",
  description:
    "Vende tus euros en Providencia al mejor precio. Gamaex en Av. Pedro de Valdivia 020: sin comisiones, pago inmediato, cotización justa EUR/CLP.",
  keywords: [
    "vender euros providencia",
    "donde vender euros en providencia",
    "precio euro venta providencia",
    "cambiar euros a pesos providencia",
    "EUR a CLP providencia",
    "mejor precio venta euro providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/vender-euros-providencia",
  },
  openGraph: {
    title: "Vender Euros en Providencia | Gamaex",
    description: "Vende euros sin comisiones en Gamaex Providencia. Pago inmediato.",
    url: "https://www.gamaex.cl/vender-euros-providencia",
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

export default async function VenderEurosProvidenciaPage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Vende tus euros en ", h1Accent: "Providencia", heroDesc: "El mejor precio para vender euros en Providencia. Gamaex en Av. Pedro de Valdivia 020 — pago inmediato, sin comisiones, cotización justa EUR/CLP.", articleHeading: "¿Cómo vender euros en Providencia y recibir pesos al instante?", articleText: "Después de un viaje o de recibir un pago desde Europa, muchos en Providencia buscan un lugar cercano para vender sus euros y quedarse con pesos. La clave está en hacerlo donde el precio se vea publicado y puedas contar los billetes con tranquilidad, en vez de cerrar la operación a la rápida en la calle. Así sabes exactamente cuánto recibes antes de entregar tus euros.\n\nEn Gamaex compramos euros al valor del día, sin comisiones ni cargos ocultos, en Av. Pedro de Valdivia 020, a pasos del Metro Pedro de Valdivia de la Línea 1. Revisamos juntos las denominaciones y aplicamos la tasa vigente, que puedes consultar de antemano en la tabla y la calculadora de esta página. Si tienes un monto alto o billetes de valor elevado, escríbenos por WhatsApp para confirmar la atención y evitar esperas.\n\nOperamos desde 1988 como negocio familiar, con atención presencial y sin reserva previa. Para operaciones de mayor volumen pedimos tu cédula de identidad y las registramos según la normativa de la UAF, un paso normal en cualquier casa de cambio formal. No somos banco: no hace falta abrir cuenta ni esperar acreditaciones, recibes tus pesos en efectivo en el momento y te vas con la operación cerrada." }} />
    </>
  );
}
