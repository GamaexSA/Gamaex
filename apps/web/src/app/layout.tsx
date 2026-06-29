import type { Metadata } from "next";
import Analytics from "@/components/analytics";
import ChatWidget from "@/components/chat-widget";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gamaex.cl"),
  title: {
    default: "Casa de Cambio Providencia · Dólares y Euros | Gamaex",
    template: "%s | Gamaex Chile",
  },
  description:
    "Casa de cambio en Providencia con 38 años de trayectoria. Compra y venta de dólares, euros y +40 divisas a pasos del Metro Pedro de Valdivia. Sin comisiones ocultas.",
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
    "cambio de dolar santiago",
    "comprar dolares chile",
    "cambio euro providencia",
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
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://www.gamaex.cl",
    languages: {
      "es-CL": "https://www.gamaex.cl",
      "en": "https://www.gamaex.cl/money-exchange-santiago",
      "x-default": "https://www.gamaex.cl",
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["FinancialService", "LocalBusiness", "CurrencyExchange"],
  "@id": "https://www.gamaex.cl/#organization",
  name: "Gamaex Chile",
  alternateName: "Inversiones y Turismo Gamaex Chile S.A.",
  legalName: "Inversiones y Turismo Gamaex Chile S.A.",
  slogan: "Seguridad, rapidez y las mejores tasas de cambio en Santiago.",
  description:
    "Casa de cambio en Providencia con 38 años de trayectoria. Compra y venta de más de 40 divisas sin comisiones ocultas, a pasos del Metro Pedro de Valdivia. Operación segura en local físico, tasas competitivas y atención personalizada.",
  url: "https://www.gamaex.cl",
  telephone: "+56229462670",
  email: "gamaex@gmail.com",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+56229462670",
      contactType: "customer service",
      areaServed: "CL",
      availableLanguage: ["Spanish", "English"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+56938782514",
      contactType: "customer service",
      areaServed: "CL",
      availableLanguage: ["Spanish", "English"],
    },
  ],
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
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "13:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "00:00",
      closes: "00:00",
      description: "Cerrado los domingos",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Santiago de Chile" },
    { "@type": "AdministrativeArea", name: "Región Metropolitana" },
  ],
  knowsAbout: [
    "Cambio de divisas",
    "Compra y venta de dólares",
    "Compra y venta de euros",
    "Compra y venta de reales brasileños",
    "Tipo de cambio en Chile",
    "Casa de cambio en Providencia",
    "Casa de cambio segura en Santiago",
    "Pago a proveedores en moneda extranjera",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      name: "Compra y venta de dólares estadounidenses (USD)",
      itemOffered: { "@type": "Service", name: "Cambio USD/CLP" },
    },
    {
      "@type": "Offer",
      name: "Compra y venta de euros (EUR)",
      itemOffered: { "@type": "Service", name: "Cambio EUR/CLP" },
    },
    {
      "@type": "Offer",
      name: "Compra y venta de divisas internacionales (más de 40 monedas)",
      itemOffered: { "@type": "Service", name: "Cambio multimoneda" },
    },
    {
      "@type": "Offer",
      name: "Transferencias internacionales y pago a proveedores",
      itemOffered: { "@type": "Service", name: "Pago a proveedores en moneda extranjera" },
    },
  ],
  currenciesAccepted: "CLP, USD, EUR, BRL, ARS, GBP, JPY, CHF, CAD, AUD, PEN, COP, UYU, CNY, MXN",
  paymentAccepted: "Cash, Bank Transfer",
  priceRange: "$$",
  image: "https://www.gamaex.cl/opengraph-image",
  hasMap:
    "https://maps.google.com/?q=Av.+Pedro+de+Valdivia+020,+Providencia,+Santiago",
  sameAs: [
    "https://g.page/r/CeFzp-LgMZyFEAE",
    "https://maps.google.com/?q=Av.+Pedro+de+Valdivia+020,+Providencia,+Santiago",
  ],
  publicAccess: true,
  isAccessibleForFree: true,
  // Nota: NO se incluye aggregateRating — Google prohíbe el "self-serving review"
  // para LocalBusiness/Organization. Las estrellas salen del Google Business Profile.
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
      name: "¿Cuál es la casa de cambio más segura para comprar dólares en Santiago?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gamaex es una casa de cambio con 38 años de trayectoria en Providencia, Santiago (fundada en 1987). Opera en local físico verificable en Av. Pedro de Valdivia 020 — sin entregas en la calle ni intermediarios. Es una sociedad anónima registrada (Inversiones y Turismo Gamaex Chile S.A.) con reseñas verificables en Google Maps. Tasas publicadas diariamente y atención personalizada.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué casa de cambio está abierta hoy sábado en la mañana en Santiago?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gamaex atiende los sábados de 09:00 a 13:00 en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia (Línea 1). De lunes a viernes el horario es de 09:00 a 17:00. Domingo cerrado. Es una opción cercana en barrio alto para cambiar divisas un sábado en la mañana sin ir al centro de Santiago.",
      },
    },
    {
      "@type": "Question",
      name: "Necesito cambiar euros a pesos chilenos con buena tasa, ¿dónde voy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gamaex compra y vende euros (EUR) a pesos chilenos (CLP) en Providencia con tasas competitivas frente al promedio del mercado en Santiago. La cotización del día está publicada en gamaex.cl y se confirma antes de cerrar la operación, sin comisiones ocultas. Para montos altos conviene consultar la tasa por WhatsApp antes de ir al local.",
      },
    },
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
        text: "Atendemos de lunes a viernes de 9:00 a 17:00 y los sábados de 9:00 a 13:00. Domingos y festivos cerrado.",
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@500;600&display=swap"
        />
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
        <ChatWidget />
      </body>
    </html>
  );
}
