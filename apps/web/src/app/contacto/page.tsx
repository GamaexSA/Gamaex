import type { Metadata } from "next";
import type { PublicRatesResponse } from "@gamaex/types";
import ContactoForm, { type MonedaOption } from "./contacto-form";

export const metadata: Metadata = {
  title: "Cotiza tu cambio de divisas | Gamaex",
  description:
    "Déjanos tus datos y te contactamos con el precio final para comprar o vender dólares, euros y +40 divisas. Casa de cambio en Providencia, sin comisiones.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/contacto" },
};

// Lista de respaldo si la API de tasas no responde: las divisas más pedidas.
const FALLBACK: MonedaOption[] = [
  { code: "USD", name: "Dólar estadounidense", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "ARS", name: "Peso argentino", flag: "🇦🇷" },
  { code: "BRL", name: "Real brasileño", flag: "🇧🇷" },
  { code: "GBP", name: "Libra esterlina", flag: "🇬🇧" },
  { code: "PEN", name: "Sol peruano", flag: "🇵🇪" },
  { code: "CHF", name: "Franco suizo", flag: "🇨🇭" },
  { code: "CAD", name: "Dólar canadiense", flag: "🇨🇦" },
  { code: "AUD", name: "Dólar australiano", flag: "🇦🇺" },
  { code: "JPY", name: "Yen japonés", flag: "🇯🇵" },
  { code: "COP", name: "Peso colombiano", flag: "🇨🇴" },
  { code: "UYU", name: "Peso uruguayo", flag: "🇺🇾" },
];

async function getMonedas(): Promise<MonedaOption[]> {
  try {
    const base = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";
    const res = await fetch(`${base}/api/rates/public`, { next: { revalidate: 300 } });
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as PublicRatesResponse;
    const monedas = (data.rates ?? [])
      .filter((r) => r.code)
      .map((r) => ({ code: r.code, name: r.name, flag: r.flag_emoji }));
    return monedas.length ? monedas : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export default async function ContactoPage() {
  const monedas = await getMonedas();
  return <ContactoForm monedas={monedas} />;
}
