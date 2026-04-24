"use client";

import { useEffect } from "react";

// Reemplazar con el Measurement ID real de Google Analytics 4
// Formato: G-XXXXXXXXXX
// Obtenerlo en: analytics.google.com → Admin → Data Streams
const GA_ID = process.env["NEXT_PUBLIC_GA_ID"];

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

// Funciones de tracking para usar en botones
export const track = {
  whatsappClick: (source: string) =>
    trackEvent("whatsapp_click", "conversion", source),
  phoneClick: () =>
    trackEvent("phone_click", "conversion", "llamada_local"),
  mapsClick: () =>
    trackEvent("maps_click", "conversion", "ver_en_maps"),
  calcUsed: (from: string, to: string) =>
    trackEvent("calculator_used", "engagement", `${from}_${to}`),
  calcWaClick: (from: string, to: string, amount: number) =>
    trackEvent("whatsapp_calc_click", "conversion", `${from}_${to}`, Math.round(amount)),
};

export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;

    const script1 = document.createElement("script");
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script1.async = true;
    document.head.appendChild(script1);

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      send_page_view: true,
    });
  }, []);

  if (!GA_ID) return null;
  return null;
}
