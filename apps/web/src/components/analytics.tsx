"use client";

import { useEffect } from "react";

// GA4 Measurement ID — formato G-XXXXXXXXXX
// analytics.google.com → Admin → Data Streams
const GA_ID = process.env["NEXT_PUBLIC_GA_ID"];

// Google Ads Conversion ID — formato AW-XXXXXXXXX
// ads.google.com → Herramientas → Conversiones → Acción de conversión
const GADS_ID = process.env["NEXT_PUBLIC_GADS_ID"];

// Etiquetas de conversión de Google Ads (parte después del "/")
// Una por cada acción de conversión creada en Google Ads.
const GADS_LABELS = {
  whatsapp: process.env["NEXT_PUBLIC_GADS_LABEL_WHATSAPP"],
  whatsappCalc: process.env["NEXT_PUBLIC_GADS_LABEL_WHATSAPP_CALC"],
  phone: process.env["NEXT_PUBLIC_GADS_LABEL_PHONE"],
  maps: process.env["NEXT_PUBLIC_GADS_LABEL_MAPS"],
  contact: process.env["NEXT_PUBLIC_GADS_LABEL_CONTACT"],
} as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}

function trackAdsConversion(
  label: string | undefined,
  value?: number,
  currency: string = "CLP",
) {
  if (!GADS_ID || !label) return;
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", {
    send_to: `${GADS_ID}/${label}`,
    value: value ?? 1,
    currency,
  });
}

export const track = {
  whatsappClick: (source: string) => {
    trackEvent("whatsapp_click", "conversion", source);
    trackAdsConversion(GADS_LABELS.whatsapp);
  },
  phoneClick: () => {
    trackEvent("phone_click", "conversion", "llamada_local");
    trackAdsConversion(GADS_LABELS.phone);
  },
  mapsClick: () => {
    trackEvent("maps_click", "conversion", "ver_en_maps");
    trackAdsConversion(GADS_LABELS.maps);
  },
  calcUsed: (from: string, to: string) =>
    trackEvent("calculator_used", "engagement", `${from}_${to}`),
  calcWaClick: (from: string, to: string, amount: number) => {
    const rounded = Math.round(amount);
    trackEvent("whatsapp_calc_click", "conversion", `${from}_${to}`, rounded);
    trackAdsConversion(GADS_LABELS.whatsappCalc, rounded);
  },
  priceAlertSubmit: (currency: string, operation: string) => {
    trackEvent("price_alert_submit", "conversion", `${operation}_${currency}`);
    trackAdsConversion(GADS_LABELS.contact);
  },
  faqOpen: (question: string) =>
    trackEvent("faq_open", "engagement", question),
  shareLink: (from: string, to: string) =>
    trackEvent("share_link_copied", "engagement", `${from}_${to}`),
};

export default function Analytics() {
  useEffect(() => {
    if (!GA_ID && !GADS_ID) return;

    const loaderId = GA_ID ?? GADS_ID;
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${loaderId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // Debe usar `arguments` (no spread) para que gtag.js procese cada hit.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());

    if (GA_ID) {
      window.gtag("config", GA_ID, { send_page_view: true });
    }
    if (GADS_ID) {
      window.gtag("config", GADS_ID, { allow_enhanced_conversions: true });
    }
  }, []);

  return null;
}
