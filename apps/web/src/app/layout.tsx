import type { Metadata } from "next";
import Analytics from "@/components/analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gamaex.cl"),
  title: {
    default: "Casa de Cambio en Providencia | Gamaex Chile — 38 años de trayectoria",
    template: "%s | Gamaex Chile",
  },
  description:
    "Casa de cambio en Providencia con 38 años de trayectoria. Compra y venta de dólares, euros, reales y más de 40 divisas a pasos del Metro Pedro de Valdivia. Precios finales, sin comisiones ocultas.",
  keywords: [
    "casa de cambio providencia",
    "cambiar dólares providencia",
    "cambio de divisas santiago",
    "money exchange providencia",
    "casa de cambio pedro de valdivia",
    "cambio euro santiago",
    "comprar dólares santiago",
    "vender dólares santiago",
    "cambio real brasileño santiago",
    "currency exchange providencia",
    "casa de cambio metro pedro de valdivia",
    "gamaex chile",
    "cambio de moneda santiago centro",
  ],
  authors: [{ name: "Gamaex Chile" }],
  creator: "Gamaex Chile",
  publisher: "Inversiones y Turismo Gamaex Chile S.A.",
  verification: {
    google: process.env["NEXT_PUBLIC_GSC_VERIFICATION"] ?? "",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.gamaex.cl",
    siteName: "Gamaex Chile",
    title: "Casa de Cambio en Providencia | Gamaex Chile — 38 años",
    description:
      "Compra y venta de dólares, euros, reales y más de 40 divisas. 38 años de trayectoria en Providencia, a pasos del Metro Pedro de Valdivia. Precios finales, sin comisiones ocultas.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gamaex Chile — Casa de cambio en Providencia, Santiago",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa de Cambio en Providencia | Gamaex Chile",
    description:
      "38 años de trayectoria. Compra y venta de divisas a pasos del Metro Pedro de Valdivia.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.gamaex.cl",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "CurrencyExchange",
  name: "Gamaex Chile",
  alternateName: "Inversiones y Turismo Gamaex Chile S.A.",
  description:
    "Casa de cambio en Providencia con 38 años de trayectoria. Compra y venta de más de 40 divisas sin comisiones ocultas, a pasos del Metro Pedro de Valdivia.",
  url: "https://www.gamaex.cl",
  telephone: "+56229462670",
  email: "gamaex@gmail.com",
  foundingDate: "1987",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Pedro de Valdivia 020",
    addressLocality: "Providencia",
    addressRegion: "Región Metropolitana",
    postalCode: "7500000",
    addressCountry: "CL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -33.4233,
    longitude: -70.6127,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "13:00",
    },
  ],
  currenciesAccepted: "CLP, USD, EUR, BRL, ARS, GBP, JPY, CHF, CAD, AUD",
  paymentAccepted: "Cash",
  priceRange: "$$",
  image: "https://www.gamaex.cl/og-image.jpg",
  hasMap:
    "https://maps.google.com/?q=Av.+Pedro+de+Valdivia+020,+Providencia,+Santiago",
  publicAccess: true,
  isAccessibleForFree: true,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "5",
    bestRating: "5",
    worstRating: "1",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Javier H. Wolnitzky" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "Solo un peso más caro por dólar, pero sin esperas. Además, aceptan dólares corrientes que no estén en circulación.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Ignacio Jorquera" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "Muy buena atención, rápida y clara. Me explicaron bien el tipo de cambio y el proceso fue ordenado. Recomendado si buscas una casa de cambio en Providencia.",
    },
    {
      "@type": "Review",
      author: { "@type": "Organization", name: "Invertaz Ltda" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "El mejor de Providencia.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Matias Schwarc" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "Rápido, el servicio espectacular, recomendable al 100%.",
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Alan S." },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: "La mejor de Providencia.",
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Gamaex Chile",
  url: "https://www.gamaex.cl",
  description: "Casa de cambio en Providencia con 38 años de trayectoria. Compra y venta de más de 40 divisas sin comisiones.",
  publisher: {
    "@type": "Organization",
    name: "Inversiones y Turismo Gamaex Chile S.A.",
    url: "https://www.gamaex.cl",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.gamaex.cl?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Compran y venden dólares en Gamaex?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Gamaex compra y vende dólares americanos (USD) y más de 40 monedas extranjeras. Los precios se publican diariamente y se confirman al momento de la operación.",
      },
    },
    {
      "@type": "Question",
      name: "¿Dónde está ubicado Gamaex?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gamaex está en Av. Pedro de Valdivia 020, Providencia, Santiago. A pasos de la salida del Metro Pedro de Valdivia (Línea 1).",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuáles son los horarios de atención?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Atendemos de lunes a viernes de 9:00 a 17:30 y los sábados de 9:00 a 13:00. Domingos y festivos cerrado.",
      },
    },
    {
      "@type": "Question",
      name: "¿Tienen comisiones adicionales?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Gamaex opera con precios finales, sin comisiones ocultas ni cargos adicionales. El precio que se indica es el precio de la operación.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo cotizar por WhatsApp antes de ir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Puedes contactarnos por WhatsApp con el monto y las monedas que quieres operar. Te confirmamos precio y disponibilidad antes de venir al local.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué monedas trabajan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Trabajamos con más de 40 monedas, incluyendo dólar americano (USD), euro (EUR), real brasileño (BRL), libra esterlina (GBP), yen japonés (JPY), peso argentino (ARS), franco suizo (CHF) y muchas más.",
      },
    },
    {
      "@type": "Question",
      name: "¿Aceptan billetes en mal estado o fuera de circulación?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aceptamos dólares corrientes que no estén en circulación, sujeto a evaluación al momento de la operación. Consúltanos por WhatsApp si tienes dudas sobre un billete específico.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hacen transferencias internacionales?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Gamaex ofrece servicios de transferencias internacionales y pagos a proveedores en moneda extranjera. Contamos con condiciones especiales para empresas que operan en moneda extranjera.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#0A0F0D" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
