import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import LandingPage from "@/components/landing-page";

const breadcrumb = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.gamaex.cl" },
    { "@type": "ListItem", position: 2, name: "Comprar Yenes Japoneses Chile", item: "https://www.gamaex.cl/comprar-yenes-japoneses-chile" },
  ],
});

export const metadata: Metadata = {
  title: "Comprar Yenes Japoneses en Chile · JPY/CLP",
  description:
    "Compra yenes japoneses en Chile para tu viaje a Japón. Gamaex en Providencia: cotización JPY/CLP actualizada, sin comisiones, atención directa.",
  keywords: [
    "comprar yenes japoneses chile",
    "donde comprar yenes en chile",
    "precio yen japones chile",
    "JPY CLP hoy",
    "comprar yenes santiago",
    "yenes japoneses providencia",
  ],
  alternates: {
    canonical: "https://www.gamaex.cl/comprar-yenes-japoneses-chile",
  },
  openGraph: {
    title: "Comprar Yenes Japoneses Chile | Gamaex Providencia",
    description: "JPY/CLP actualizado. Compra yenes japoneses en Gamaex Providencia sin comisiones.",
    url: "https://www.gamaex.cl/comprar-yenes-japoneses-chile",
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

export default async function ComprarYenesJaponesesChilePage() {
  const data = await getRates();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumb }} />
      <LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "Comprar yenes japoneses en ", h1Accent: "Chile", heroDesc: "Compra yenes japoneses (JPY) para tu viaje a Japón. Gamaex en Providencia — cotización JPY/CLP actualizada, sin comisiones.", articleHeading: "¿Cómo compro yenes japoneses en efectivo antes de viajar a Japón?", articleText: "Comprar yenes japoneses (JPY) en efectivo es clave para quienes viajan a Japón, porque en muchos comercios, templos y transportes locales todavía se usa harto dinero en mano. Los buscan turistas que arman su ruta por Tokio, Kioto y Osaka, aficionados a la cultura japonesa, y profesionales que asisten a ferias de tecnología o reuniones de negocios. Llegar con yenes desde Chile te ahorra apuros los primeros días, cuando aún estás ubicándote en el país.\n\nEn Gamaex compras yenes japoneses al precio del día, siempre visible en la tabla de tasas y en la calculadora del propio sitio, sin comisiones ni cargos escondidos. Estamos en Av. Pedro de Valdivia 020, Providencia, con atención presencial y sin necesidad de reservar hora. Como el yen no es de circulación masiva en el comercio local, te recomendamos confirmar disponibilidad de billetes por WhatsApp antes de acercarte, especialmente si necesitas un monto importante para todo tu viaje.\n\nGamaex opera desde 1988 como casa de cambio familiar y se ubica a pasos del Metro Pedro de Valdivia, en la Línea 1, con acceso cómodo desde toda la ciudad. No somos banco: la compra es inmediata y no requiere abrir cuenta ni trámites largos. Para montos altos se pide la cédula de identidad y se registra la operación según la normativa UAF. Consulta el valor actualizado del día y compra tus yenes con la tasa a la vista, cara a cara y con total claridad antes de viajar." }} />
    </>
  );
}
