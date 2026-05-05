"use client";

import { useState, useEffect } from "react";
import type { PublicRate } from "@gamaex/types";
import { track } from "./analytics";

// ─── CONFIGURACIÓN WhatsApp ───────────────────────────────────────────────────
const WA_NUMBER = "56938782514";
const FIXED_PHONE = "+56 2 2946 2670";
const WA_MSG = "Hola, quiero consultar una cotización en Gamaex.";
const wa = (msg?: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg ?? WA_MSG)}`;
// ─────────────────────────────────────────────────────────────────────────────

interface PageContext {
  h1Before?: string;
  h1Accent?: string;
  heroDesc?: string;
  articleText?: string;
}

export type LandingVariant = "full" | "home" | "servicios" | "alerta" | "faq";

interface Props {
  rates: PublicRate[];
  systemStatus: string;
  lastSyncAt: string;
  pageContext?: PageContext;
  variant?: LandingVariant;
}

const navHref = (variant: LandingVariant, target: string) => {
  if (variant === "full") return `#${target}`;
  switch (target) {
    case "tasas": return "/#tasas";
    case "opiniones": return "/#opiniones";
    case "ubicacion": return "/#ubicacion";
    case "servicios": return "/servicios";
    case "alerta-precio": return "/alerta-de-precio";
    case "faq": return "/preguntas-frecuentes";
    default: return `#${target}`;
  }
};

const FAQ_ITEMS = [
  { q: "¿Compran y venden dólares?", a: "Sí. Compramos y vendemos dólares americanos (USD) y más de 40 monedas. Los precios se publican diariamente y se confirman al momento de la operación." },
  { q: "¿Tienen comisiones adicionales?", a: "No. Operamos con precios finales. Sin comisiones ocultas, sin cargos extra. El precio que ves es el precio de la operación." },
  { q: "¿Puedo cotizar por WhatsApp antes de ir?", a: "Sí. Escríbenos con el monto y las monedas que quieres operar. Te confirmamos precio y disponibilidad al instante." },
  { q: "¿Qué monedas trabajan?", a: "Más de 40 monedas: dólar (USD), euro (EUR), real brasileño (BRL), libra esterlina (GBP), yen japonés (JPY), peso argentino (ARS), franco suizo (CHF) y muchas más." },
  { q: "¿Cuáles son los horarios de atención?", a: "Lunes a viernes de 9:00 a 17:00 y sábados de 9:00 a 13:00. Domingos y festivos cerrado." },
  { q: "¿Aceptan billetes en mal estado o fuera de circulación?", a: "Aceptamos dólares corrientes que no estén en circulación, sujeto a evaluación en el momento. Consúltanos por WhatsApp si tienes dudas sobre un billete específico." },
  { q: "¿Hacen transferencias internacionales?", a: "Sí. Ofrecemos transferencias internacionales y pago a proveedores en moneda extranjera. Tenemos condiciones especiales para empresas." },
  { q: "¿Cómo llego al local?", a: "Estamos en Av. Pedro de Valdivia 020, Providencia. A pasos de la salida del Metro Pedro de Valdivia (Línea 1). También cerca de Costanera Center." },
];

const CURRENCY_GRID = [
  { flag: "🇺🇸", code: "USD" }, { flag: "🇪🇺", code: "EUR" }, { flag: "🇧🇷", code: "BRL" }, { flag: "🇬🇧", code: "GBP" },
  { flag: "🇦🇷", code: "ARS" }, { flag: "🇨🇭", code: "CHF" }, { flag: "🇯🇵", code: "JPY" }, { flag: "🇨🇦", code: "CAD" },
  { flag: "🇦🇺", code: "AUD" }, { flag: "🇲🇽", code: "MXN" }, { flag: "🇵🇪", code: "PEN" }, { flag: "🇨🇴", code: "COP" },
  { flag: "🇺🇾", code: "UYU" }, { flag: "🇨🇳", code: "CNY" }, { flag: "🇰🇷", code: "KRW" }, { flag: "🇳🇿", code: "NZD" },
  { flag: "🇸🇪", code: "SEK" }, { flag: "🇳🇴", code: "NOK" }, { flag: "🇩🇰", code: "DKK" }, { flag: "🇮🇱", code: "ILS" },
  { flag: "🇿🇦", code: "ZAR" }, { flag: "🇹🇼", code: "TWD" }, { flag: "🇮🇳", code: "INR" }, { flag: "🇹🇭", code: "THB" },
];

const TESTIMONIALS = [
  { name: "Javier H. Wolnitzky", initial: "JW", context: "Cambia USD mensualmente", text: "Solo un peso más caro por dólar, pero sin esperas. Además, aceptan dólares corrientes que no estén en circulación." },
  { name: "Ignacio Jorquera", initial: "IJ", context: "Vino por turismo a Chile", text: "Muy buena atención, rápida y clara. Me explicaron bien el tipo de cambio y el proceso fue ordenado. Recomendado si buscas casa de cambio en Providencia." },
  { name: "Matías Schwarc", initial: "MS", context: "Cliente desde 2019", text: "Rápido, el servicio espectacular, recomendable al 100%. La mejor de Providencia, sin lugar a dudas." },
];

export default function LandingPage({ rates, systemStatus, lastSyncAt, pageContext, variant = "full" }: Props) {
  const h1Before = pageContext?.h1Before ?? "Casa de cambio en ";
  const h1Accent = pageContext?.h1Accent ?? "Providencia";
  const heroDesc = pageContext?.heroDesc ?? "38 años de trayectoria a pasos del Metro Pedro de Valdivia. Compra y venta de dólares, euros, reales y más de 40 divisas.";

  const isFull = variant === "full";
  const showHero      = isFull || variant === "home";
  const showTicker    = isFull || variant === "home";
  const showStats     = isFull || variant === "home";
  const showPasos     = isFull || variant === "servicios";
  const showDivisas   = isFull || variant === "servicios";
  const showTasas     = isFull || variant === "home";
  const showServicios = isFull || variant === "servicios";
  const showZero      = isFull || variant === "servicios";
  const showVs        = isFull || variant === "servicios";
  const showVideo     = isFull || variant === "servicios";
  const showAlerta    = isFull || variant === "alerta";
  const showOpiniones = isFull || variant === "home";
  const showFaq       = isFull || variant === "faq";
  const showUbicacion = isFull || variant === "home";
  const showPageHeader = !isFull && !showHero;

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("CLP");
  const [amount, setAmount] = useState("1000");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  // Alerta de precio
  const [alertName, setAlertName] = useState("");
  const [alertWhatsapp, setAlertWhatsapp] = useState("");
  const [alertCurrency, setAlertCurrency] = useState(rates[0]?.code ?? "USD");
  const [alertOperation, setAlertOperation] = useState<"BUY" | "SELL">("BUY");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertAmount, setAlertAmount] = useState("");
  const [alertComment, setAlertComment] = useState("");
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertError, setAlertError] = useState("");

  const alertRate = rates.find((r) => r.code === alertCurrency);

  async function submitAlert(e: React.FormEvent) {
    e.preventDefault();
    setAlertError("");
    setAlertLoading(true);
    try {
      const apiUrl = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";
      const res = await fetch(`${apiUrl}/api/price-alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: alertName.trim(),
          whatsapp: alertWhatsapp.trim(),
          currency_code: alertCurrency,
          operation: alertOperation,
          target_price: parseFloat(alertPrice),
          amount: alertAmount ? parseFloat(alertAmount) : undefined,
          comment: alertComment.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message ?? "Error al enviar la solicitud");
      }
      setAlertSuccess(true);
    } catch (err: unknown) {
      setAlertError(err instanceof Error ? err.message : "Error al enviar. Intenta nuevamente.");
    } finally {
      setAlertLoading(false);
    }
  }

  useEffect(() => {
    function checkOpen() {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
      const day = now.getDay();
      const mins = now.getHours() * 60 + now.getMinutes();
      if (day >= 1 && day <= 5) setIsOpen(mins >= 540 && mins < 1020);
      else if (day === 6) setIsOpen(mins >= 540 && mins < 780);
      else setIsOpen(false);
    }
    checkOpen();
    const t = setInterval(checkOpen, 60_000);
    return () => clearInterval(t);
  }, []);

  function copyShareLink() {
    const url = `${window.location.origin}?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      track.shareLink(fromCurrency, toCurrency);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const to = params.get("to");
    const amt = params.get("amount");
    if (from) setFromCurrency(from);
    if (to) setToCurrency(to);
    if (amt) setAmount(amt);
  }, []);

  // ── Calculadora ──────────────────────────────────────────────────────────────
  const selectOptions = [
    { code: "CLP", flag_emoji: "🇨🇱", name: "Peso Chileno" },
    ...rates.map((r) => ({ code: r.code, flag_emoji: r.flag_emoji, name: r.name })),
  ];

  const fromRate = rates.find((r) => r.code === fromCurrency);
  const toRate = rates.find((r) => r.code === toCurrency);
  const numAmount = parseFloat(amount) || 0;

  function calcResult(): { value: number; decimals: number; code: string } {
    if (fromCurrency === toCurrency) return { value: numAmount, decimals: 2, code: toCurrency };
    if (fromCurrency !== "CLP" && toCurrency === "CLP") {
      if (!fromRate?.buy) return { value: 0, decimals: 0, code: "CLP" };
      return { value: numAmount * fromRate.buy, decimals: 0, code: "CLP" };
    }
    if (fromCurrency === "CLP" && toCurrency !== "CLP") {
      if (!toRate?.sell) return { value: 0, decimals: toRate?.decimal_places ?? 2, code: toCurrency };
      return { value: numAmount / toRate.sell, decimals: toRate.decimal_places ?? 2, code: toCurrency };
    }
    if (fromRate?.buy && toRate?.sell) {
      const clp = numAmount * fromRate.buy;
      return { value: clp / toRate.sell, decimals: toRate.decimal_places ?? 2, code: toCurrency };
    }
    return { value: 0, decimals: 2, code: toCurrency };
  }

  const result = calcResult();
  const hasResult = result.value > 0 && numAmount > 0;

  const waCalcMsg = hasResult
    ? `Hola, quiero cotizar ${numAmount.toLocaleString("es-CL")} ${fromCurrency} a ${toCurrency} en Gamaex. ¿Pueden confirmarme precio y disponibilidad?`
    : WA_MSG;

  function swap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }
  function changeFrom(next: string) {
    const newTo = next === toCurrency ? (next === "CLP" ? rates[0]?.code ?? "USD" : "CLP") : toCurrency;
    setFromCurrency(next);
    if (next === toCurrency) setToCurrency(newTo);
    track.calcUsed(next, newTo);
  }
  function changeTo(next: string) {
    const newFrom = next === fromCurrency ? (next === "CLP" ? rates[0]?.code ?? "USD" : "CLP") : fromCurrency;
    setToCurrency(next);
    if (next === fromCurrency) setFromCurrency(newFrom);
    track.calcUsed(newFrom, next);
  }

  const lastSyncFmt = lastSyncAt
    ? new Date(lastSyncAt).toLocaleString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago" })
    : "";

  return (
    <div className="gx-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --gold-light: #E8C76E; --gold: #C9A84C; --gold-deep: #9C7E2E; --gold-darker: #75591F;
          --dark: #0F1419; --dark-2: #1A1F26;
          --gray: #6B7280; --gray-light: #9CA3AF;
          --light: #FAF8F2; --light-2: #F3F0E6;
          --white: #FFFFFF; --border: #E8E4D6;
          --green-wa: #25D366; --red: #DC2626; --red-soft: #FEE2E2;
        }
        .gx-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: var(--dark); background: var(--white); line-height: 1.5; -webkit-font-smoothing: antialiased; }
        .gx-root a { text-decoration: none; }
        html { scroll-behavior: smooth; }

        /* NAV */
        .gx-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.94); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 6%; height: 86px; }
        .gx-logo { display: flex; align-items: center; gap: 0.6rem; }
        .gx-logo svg { height: 60px; width: auto; }
        .gx-nav-links { display: flex; gap: 2rem; list-style: none; }
        .gx-nav-links a { font-size: 0.92rem; font-weight: 500; color: var(--gray); transition: color 0.2s; }
        .gx-nav-links a:hover { color: var(--dark); }
        .gx-nav-actions { display: flex; align-items: center; gap: 1rem; }
        .gx-status { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; font-weight: 600; padding: 0.35rem 0.8rem; border-radius: 50px; }
        .gx-status.open { color: var(--gold-deep); background: rgba(201,168,76,0.15); }
        .gx-status.closed { color: var(--gray); background: rgba(107,114,128,0.1); }
        .gx-status .dot { width: 7px; height: 7px; border-radius: 50%; animation: pulseDot 2s infinite; }
        .gx-status.open .dot { background: var(--gold-deep); }
        .gx-status.closed .dot { background: var(--gray); }
        @keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .gx-cta-dark { background: var(--dark); color: var(--white); padding: 0.65rem 1.5rem; border-radius: 50px; font-size: 0.9rem; font-weight: 600; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; border: none; font-family: inherit; }
        .gx-cta-dark:hover { background: #2A3038; transform: translateY(-1px); }
        .gx-cta-gold { background: var(--gold); color: var(--dark); padding: 0.95rem 1.4rem; border-radius: 12px; font-size: 1rem; font-weight: 700; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; border: none; font-family: inherit; width: 100%; }
        .gx-cta-gold:hover { background: var(--gold-deep); color: var(--white); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(201,168,76,0.35); }
        .gx-cta-gold:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .gx-cta-outline { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.85rem 1.4rem; border: 1.5px solid var(--dark); border-radius: 50px; color: var(--dark); font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
        .gx-cta-outline:hover { background: var(--dark); color: var(--white); }

        /* HERO */
        .gx-hero { padding: 100px 6% 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; background: linear-gradient(180deg, var(--white) 0%, var(--light) 100%); }
        .gx-hero-tag { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 1rem; border-radius: 50px; background: rgba(201,168,76,0.15); color: var(--gold-deep); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.3px; margin-bottom: 1.2rem; }
        .gx-hero h1 { font-size: clamp(2rem, 4.5vw, 3.4rem); font-weight: 800; line-height: 1.1; letter-spacing: -1.5px; color: var(--dark); }
        .gx-hero h1 em { font-style: normal; color: var(--gold-deep); }
        .gx-hero p.lead { margin-top: 1.4rem; font-size: 1.1rem; color: var(--gray); line-height: 1.7; max-width: 460px; }
        .gx-badges { display: flex; gap: 0.7rem; margin-top: 2rem; flex-wrap: wrap; }
        .gx-badge { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.5rem 1rem; border-radius: 50px; border: 1.5px solid var(--border); font-size: 0.83rem; font-weight: 500; color: var(--gray); background: var(--white); }
        .gx-badge .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold-deep); }

        /* CONVERTER */
        .gx-converter { background: var(--white); border-radius: 24px; border: 1.5px solid var(--border); padding: 2rem; box-shadow: 0 24px 64px rgba(0,0,0,0.08); }
        .gx-converter h3 { font-size: 0.95rem; font-weight: 600; color: var(--gray); margin-bottom: 1.4rem; }
        .gx-pairs { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .gx-pair { background: var(--light-2); border: 1px solid var(--border); color: var(--gray); padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .gx-pair:hover { border-color: var(--gold); color: var(--gold-deep); }
        .gx-pair.active { background: rgba(201,168,76,0.18); border-color: var(--gold); color: var(--gold-deep); }
        .gx-conv-row { background: var(--light); border-radius: 14px; padding: 1.05rem 1.2rem; margin-bottom: 0.6rem; display: flex; justify-content: space-between; align-items: center; gap: 0.8rem; }
        .gx-conv-label { font-size: 0.74rem; color: var(--gray); font-weight: 500; display: block; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .gx-conv-amount { font-size: 1.65rem; font-weight: 700; color: var(--dark); border: none; background: transparent; outline: none; width: 100%; font-family: inherit; padding: 0; }
        .gx-conv-amount.result { color: var(--gold-deep); }
        .gx-conv-select { background: var(--white); border: 1.5px solid var(--border); border-radius: 10px; padding: 0.55rem 0.8rem; font-weight: 600; font-size: 0.9rem; cursor: pointer; font-family: inherit; outline: none; transition: border-color 0.15s; min-width: 110px; }
        .gx-conv-select:hover { border-color: var(--gold); }
        .gx-swap-wrap { display: flex; justify-content: center; margin: 0.4rem 0; }
        .gx-swap-wrap button { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--white); font-size: 1.1rem; cursor: pointer; transition: all 0.25s; color: var(--dark); }
        .gx-swap-wrap button:hover { background: var(--gold); border-color: var(--gold-deep); transform: rotate(180deg); }
        .gx-rate-info { display: flex; justify-content: space-between; align-items: center; margin: 1rem 0; padding: 0 0.2rem; }
        .gx-rate-info span { font-size: 0.82rem; color: var(--gray); }
        .gx-rate-info strong { font-size: 0.88rem; color: var(--dark); font-weight: 700; }
        .gx-secure-note { text-align: center; margin-top: 0.85rem; font-size: 0.76rem; color: var(--gray); }
        .gx-share-btn { width: 100%; margin-top: 0.6rem; background: transparent; border: 1.5px solid var(--border); border-radius: 12px; color: var(--gray); font-size: 0.85rem; padding: 0.75rem; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .gx-share-btn:hover { border-color: var(--gold); color: var(--gold-deep); }
        .gx-share-btn.copied { color: #059669; border-color: #059669; }

        /* TICKER */
        .gx-ticker { background: var(--dark); color: var(--white); padding: 0.85rem 0; overflow: hidden; }
        .gx-ticker-track { display: flex; gap: 4rem; width: max-content; animation: scrollTicker 40s linear infinite; }
        .gx-ticker-item { display: flex; align-items: center; gap: 0.55rem; font-size: 0.88rem; white-space: nowrap; font-weight: 500; }
        .gx-ticker-item strong { font-weight: 700; color: var(--gold-light); }
        .gx-ticker-meta { color: rgba(255,255,255,0.5); font-size: 0.8rem; }
        .gx-ticker-meta span { color: var(--gold); }
        @keyframes scrollTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* STATS */
        .gx-stats { display: grid; grid-template-columns: repeat(4, 1fr); background: var(--light); }
        .gx-stat { background: var(--white); padding: 3rem 1.5rem; text-align: center; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .gx-stat:last-child { border-right: none; }
        .gx-stat h3 { font-size: 3rem; font-weight: 800; color: var(--dark); letter-spacing: -2.5px; line-height: 1; }
        .gx-stat h3 span { color: var(--gold-deep); }
        .gx-stat p { font-size: 0.88rem; color: var(--gray); margin-top: 0.5rem; font-weight: 500; }

        /* SECTIONS */
        .gx-page-header { padding: 130px 6% 3rem; background: linear-gradient(180deg, var(--white) 0%, var(--light) 100%); text-align: center; }
        .gx-page-header .gx-label { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 1rem; border-radius: 50px; background: rgba(201,168,76,0.15); color: var(--gold-deep); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.3px; margin-bottom: 1.2rem; }
        .gx-page-header h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 800; line-height: 1.1; letter-spacing: -1.5px; color: var(--dark); }
        .gx-page-header h1 em { font-style: normal; color: var(--gold-deep); }
        .gx-page-header p { margin-top: 1.2rem; font-size: 1.05rem; color: var(--gray); line-height: 1.7; max-width: 640px; margin-left: auto; margin-right: auto; }
        .gx-section { padding: 5.5rem 6%; }
        .gx-section-light { background: var(--light); }
        .gx-section-dark { background: var(--dark); color: var(--white); }
        .gx-label { font-size: 0.78rem; font-weight: 700; letter-spacing: 2.5px; color: var(--gold-deep); text-transform: uppercase; }
        .gx-section-dark .gx-label { color: var(--gold); }
        .gx-title { font-size: clamp(1.7rem, 3vw, 2.5rem); font-weight: 800; letter-spacing: -1px; color: var(--dark); margin-top: 0.6rem; line-height: 1.15; }
        .gx-section-dark .gx-title { color: var(--white); }
        .gx-subtitle { font-size: 1.05rem; color: var(--gray); margin-top: 1rem; max-width: 580px; line-height: 1.6; }
        .gx-section-dark .gx-subtitle { color: rgba(255,255,255,0.65); }

        /* 3 PASOS */
        .gx-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem; margin-top: 3rem; }
        .gx-step { background: var(--white); border: 1.5px solid var(--border); border-radius: 18px; padding: 2.2rem 1.7rem; position: relative; transition: all 0.25s; }
        .gx-step:hover { border-color: var(--gold); transform: translateY(-4px); box-shadow: 0 12px 32px rgba(201,168,76,0.12); }
        .gx-step-num { position: absolute; top: -18px; left: 1.7rem; background: var(--gold); color: var(--dark); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.05rem; }
        .gx-step-icon { font-size: 1.8rem; display: block; margin-bottom: 0.7rem; margin-top: 1rem; }
        .gx-step h4 { font-size: 1.1rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem; }
        .gx-step p { font-size: 0.9rem; color: var(--gray); line-height: 1.65; }

        /* CURRENCIES GRID */
        .gx-currencies { display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.75rem; margin-top: 3rem; }
        .gx-currency-chip { background: var(--white); border: 1.5px solid var(--border); border-radius: 12px; padding: 1.1rem 0.5rem; text-align: center; transition: all 0.2s; }
        .gx-currency-chip:hover { border-color: var(--gold); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
        .gx-currency-chip .flag { font-size: 1.7rem; display: block; margin-bottom: 0.35rem; }
        .gx-currency-chip .code { font-size: 0.75rem; font-weight: 700; color: var(--dark); letter-spacing: 0.5px; }
        .gx-currencies-cta { text-align: center; margin-top: 2rem; color: var(--gray); font-size: 0.95rem; }
        .gx-currencies-cta a { color: var(--gold-deep); font-weight: 700; }

        /* RATES TABLE */
        .gx-rates-wrap { background: var(--white); border-radius: 18px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); margin-top: 2.5rem; overflow: hidden; }
        .gx-rates-meta { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; }
        .gx-stale-warn { font-size: 0.82rem; color: #B45309; background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 0.5rem 1rem; margin-top: 1rem; display: inline-block; }
        .gx-rates-table { width: 100%; border-collapse: collapse; }
        .gx-rates-table th { background: var(--dark); color: var(--white); padding: 1rem 1.5rem; text-align: left; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .gx-rates-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
        .gx-rates-table tr:last-child td { border-bottom: none; }
        .gx-rates-table tr.clickable { cursor: pointer; transition: background 0.15s; }
        .gx-rates-table tr.clickable:hover td { background: var(--light); }
        .gx-rate-flag { font-size: 1.4rem; vertical-align: middle; margin-right: 0.5rem; }
        .gx-rate-buy { color: #059669; font-weight: 700; }
        .gx-rate-sell { color: var(--red); font-weight: 700; }
        .gx-rates-empty { padding: 3rem 1.5rem; text-align: center; color: var(--gray); font-size: 0.95rem; }
        .gx-rates-empty a { color: var(--gold-deep); font-weight: 700; }
        .gx-rates-foot { font-size: 0.82rem; color: var(--gray); margin-top: 1rem; text-align: center; }

        /* SERVICES */
        .gx-services { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-top: 3rem; }
        .gx-service { background: var(--white); border: 1.5px solid var(--border); border-radius: 18px; padding: 2rem 1.5rem; transition: all 0.3s; }
        .gx-service:hover { border-color: var(--gold); box-shadow: 0 12px 36px rgba(201,168,76,0.14); transform: translateY(-6px); }
        .gx-service-icon { width: 50px; height: 50px; border-radius: 12px; background: rgba(201,168,76,0.18); color: var(--gold-deep); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.1rem; }
        .gx-service h4 { font-size: 1.05rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem; }
        .gx-service p { font-size: 0.88rem; color: var(--gray); line-height: 1.65; }

        /* 0% */
        .gx-zero { background: var(--gold); padding: 5rem 6%; text-align: center; }
        .gx-zero .gx-label { color: var(--dark); }
        .gx-zero .big { font-size: clamp(5rem, 12vw, 9rem); font-weight: 900; color: var(--dark); letter-spacing: -6px; line-height: 1; margin-top: 0.5rem; }
        .gx-zero .big span { font-size: 0.55em; vertical-align: top; }
        .gx-zero h3 { font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 800; color: var(--dark); margin-top: 1rem; letter-spacing: -1px; }
        .gx-zero p { font-size: 1.05rem; color: rgba(0,0,0,0.7); margin-top: 1rem; max-width: 580px; margin-left: auto; margin-right: auto; line-height: 1.6; }

        /* VS APPS */
        .gx-vs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
        .gx-vs-card { border-radius: 20px; padding: 2.3rem; }
        .gx-vs-card.them { background: var(--light); border: 1.5px solid var(--border); color: var(--gray); }
        .gx-vs-card.us { background: var(--dark); color: var(--white); position: relative; overflow: hidden; }
        .gx-vs-card.us::before { content: "TÚ ELIGES"; position: absolute; top: 1.4rem; right: 1.4rem; background: var(--gold); color: var(--dark); padding: 0.3rem 0.7rem; border-radius: 50px; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.5px; }
        .gx-vs-card h4 { font-size: 1.35rem; font-weight: 800; margin-bottom: 1.4rem; }
        .gx-vs-card.them h4 { color: var(--gray); }
        .gx-vs-list { list-style: none; display: flex; flex-direction: column; gap: 0.95rem; }
        .gx-vs-list li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.93rem; line-height: 1.5; }
        .gx-vs-card.them li { color: var(--gray); }
        .gx-vs-card.us li { color: rgba(255,255,255,0.9); }
        .gx-vs-list .check { color: var(--gold); font-weight: 800; flex-shrink: 0; }
        .gx-vs-list .x { color: var(--red); font-weight: 800; flex-shrink: 0; }

        /* TESTIMONIOS */
        .gx-testimonials { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
        .gx-testimonial { background: var(--white); border-radius: 18px; padding: 2rem; border: 1.5px solid var(--border); transition: all 0.25s; }
        .gx-testimonial:hover { border-color: var(--gold); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .gx-stars { display: flex; gap: 2px; margin-bottom: 1rem; color: #F59E0B; font-size: 1rem; }
        .gx-testimonial-text { font-size: 0.95rem; color: var(--dark); line-height: 1.6; margin-bottom: 1.2rem; }
        .gx-testimonial-author { display: flex; align-items: center; gap: 0.7rem; }
        .gx-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; color: var(--dark); flex-shrink: 0; }
        .gx-testimonial-author p { font-weight: 600; font-size: 0.9rem; color: var(--dark); }
        .gx-testimonial-author span { font-size: 0.78rem; color: var(--gray); }

        /* ALERTA */
        .gx-alert-section { background: linear-gradient(135deg, var(--dark) 0%, #1A2330 100%); color: var(--white); padding: 5.5rem 6%; }
        .gx-alert-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 4rem; margin-top: 3rem; align-items: start; }
        .gx-alert-info h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.2rem; line-height: 1.3; }
        .gx-alert-step { display: flex; gap: 1rem; padding: 1.2rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .gx-alert-step:last-child { border-bottom: none; }
        .gx-alert-step-num { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--gold); color: var(--dark); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; }
        .gx-alert-step strong { display: block; font-size: 1rem; margin-bottom: 0.2rem; color: var(--white); }
        .gx-alert-step span { font-size: 0.88rem; color: rgba(255,255,255,0.65); line-height: 1.55; }
        .gx-alert-form { background: var(--white); color: var(--dark); border-radius: 24px; padding: 2.3rem; box-shadow: 0 24px 64px rgba(0,0,0,0.18); }
        .gx-alert-form h4 { font-size: 1.18rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--dark); }
        .gx-alert-form .sub { font-size: 0.92rem; color: var(--gray); margin-bottom: 1.5rem; }
        .gx-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
        .gx-form-full { grid-column: 1 / -1; }
        .gx-form-field label { display: block; font-size: 0.76rem; font-weight: 700; color: var(--dark); margin-bottom: 0.4rem; letter-spacing: 0.3px; text-transform: uppercase; }
        .gx-form-field input, .gx-form-field select, .gx-form-field textarea { width: 100%; padding: 0.85rem 1rem; border: 1.5px solid var(--border); border-radius: 10px; font-size: 0.95rem; font-family: inherit; color: var(--dark); background: var(--white); outline: none; transition: border-color 0.15s; }
        .gx-form-field input:focus, .gx-form-field select:focus, .gx-form-field textarea:focus { border-color: var(--gold); }
        .gx-form-field textarea { resize: vertical; min-height: 70px; }
        .gx-op-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; padding: 0.3rem; background: var(--light); border-radius: 10px; }
        .gx-op-toggle button { padding: 0.65rem; border: none; background: transparent; cursor: pointer; font-weight: 600; font-size: 0.86rem; color: var(--gray); border-radius: 8px; font-family: inherit; transition: all 0.15s; }
        .gx-op-toggle button.active { background: var(--white); color: var(--dark); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .gx-current-rate { font-size: 0.82rem; color: var(--gray); margin-top: 0.5rem; }
        .gx-current-rate .buy { color: #059669; font-weight: 700; }
        .gx-current-rate .sell { color: var(--red); font-weight: 700; }
        .gx-form-disclaimer { font-size: 0.78rem; color: var(--gray); line-height: 1.55; margin-top: 0.8rem; background: var(--light); padding: 0.85rem 1rem; border-radius: 10px; }
        .gx-form-error { font-size: 0.88rem; color: var(--red); background: var(--red-soft); border-radius: 10px; padding: 0.7rem 1rem; }
        .gx-success { background: rgba(5,150,105,0.08); border: 1.5px solid #059669; border-radius: 18px; padding: 2.5rem 1.5rem; text-align: center; }
        .gx-success-icon { font-size: 2.5rem; margin-bottom: 1rem; color: #059669; }
        .gx-success h3 { font-size: 1.3rem; color: #059669; margin-bottom: 0.8rem; font-weight: 700; }
        .gx-success p { color: var(--gray); margin-bottom: 1.2rem; line-height: 1.65; font-size: 0.95rem; }
        .gx-success-btn { background: transparent; border: 1.5px solid #059669; color: #059669; padding: 0.7rem 1.4rem; border-radius: 10px; font-size: 0.88rem; cursor: pointer; font-family: inherit; }

        /* FAQ */
        .gx-faq-list { max-width: 820px; margin: 3rem auto 0; }
        .gx-faq-item { border-bottom: 1px solid var(--border); }
        .gx-faq-q { width: 100%; background: none; border: none; cursor: pointer; padding: 1.4rem 0; font-size: 1.02rem; font-weight: 600; color: var(--dark); display: flex; justify-content: space-between; align-items: center; text-align: left; font-family: inherit; gap: 1rem; }
        .gx-faq-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--light); display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; font-size: 1rem; color: var(--dark); }
        .gx-faq-item.open .gx-faq-icon { background: var(--gold); color: var(--dark); transform: rotate(45deg); }
        .gx-faq-a { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }
        .gx-faq-item.open .gx-faq-a { max-height: 320px; padding-bottom: 1.4rem; }
        .gx-faq-a p { color: var(--gray); line-height: 1.65; font-size: 0.95rem; }
        .gx-faq-cta { text-align: center; margin-top: 2.5rem; }
        .gx-faq-cta p { color: var(--gray); margin-bottom: 1rem; font-size: 0.95rem; }

        /* UBICACIÓN */
        .gx-loc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 3rem; align-items: start; }
        .gx-loc-info-row { display: flex; align-items: flex-start; gap: 0.85rem; padding: 0.9rem 0; border-bottom: 1px solid var(--border); }
        .gx-loc-info-row:last-child { border-bottom: none; }
        .gx-loc-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(201,168,76,0.18); color: var(--gold-deep); display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
        .gx-loc-info-row strong { display: block; color: var(--dark); font-size: 0.92rem; margin-bottom: 0.18rem; }
        .gx-loc-info-row span { color: var(--gray); font-size: 0.9rem; }
        .gx-loc-cta { display: flex; gap: 0.7rem; margin-top: 1.4rem; flex-wrap: wrap; }
        .gx-map-wrap { border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.08); height: 420px; }
        .gx-map-wrap iframe { width: 100%; height: 100%; border: 0; }

        /* HOURS GRID */
        .gx-hours { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; }
        .gx-hour-card { background: var(--light); border: 1.5px solid var(--border); border-radius: 12px; padding: 1.1rem 1.2rem; }
        .gx-hour-card .day { font-size: 0.7rem; color: var(--gray); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 0.3rem; }
        .gx-hour-card .time { font-size: 1.05rem; font-weight: 700; color: var(--dark); }
        .gx-hour-card .time.closed { color: var(--red); }

        /* VIDEO LOCAL */
        .gx-video-wrap { border-radius: 20px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.1); margin-top: 3rem; max-width: 900px; margin-left: auto; margin-right: auto; }
        .gx-video-wrap video { width: 100%; display: block; }

        /* ARTICLE */
        .gx-article { padding: 4rem 6%; max-width: 760px; margin: 0 auto; border-top: 1px solid var(--border); }
        .gx-article p { font-size: 1.02rem; color: var(--gray); line-height: 1.8; }

        /* FOOTER */
        .gx-footer { background: var(--dark); color: var(--white); padding: 4.5rem 6% 2rem; }
        .gx-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3.5rem; margin-bottom: 3rem; }
        .gx-footer-brand svg { height: 72px; margin-bottom: 1.3rem; }
        .gx-footer-brand p { font-size: 0.88rem; color: rgba(255,255,255,0.55); line-height: 1.7; max-width: 320px; }
        .gx-footer-col h5 { font-size: 0.76rem; font-weight: 700; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 1.2rem; }
        .gx-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; }
        .gx-footer-col a, .gx-footer-col span.staticline { font-size: 0.9rem; color: rgba(255,255,255,0.75); transition: color 0.2s; }
        .gx-footer-col a:hover { color: var(--gold-light); }
        .gx-footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.8rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: rgba(255,255,255,0.45); flex-wrap: wrap; gap: 0.5rem; }

        /* FLOAT WHATSAPP */
        .gx-wa-float { position: fixed; bottom: 28px; right: 28px; width: 60px; height: 60px; border-radius: 50%; background: var(--green-wa); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.7rem; box-shadow: 0 8px 24px rgba(37,211,102,0.45); z-index: 99; transition: all 0.2s; }
        .gx-wa-float:hover { transform: scale(1.08); box-shadow: 0 12px 32px rgba(37,211,102,0.55); }

        /* RESPONSIVE */
        @media (max-width: 968px) {
          .gx-nav-links { display: none; }
          .gx-hero { grid-template-columns: 1fr; padding: 100px 6% 3rem; gap: 2.5rem; }
          .gx-stats { grid-template-columns: repeat(2, 1fr); }
          .gx-steps, .gx-services, .gx-testimonials, .gx-vs, .gx-loc-grid, .gx-alert-grid { grid-template-columns: 1fr; }
          .gx-currencies { grid-template-columns: repeat(4, 1fr); }
          .gx-section { padding: 3.5rem 6%; }
          .gx-rates-table th, .gx-rates-table td { padding: 0.8rem 0.7rem; font-size: 0.85rem; }
          .gx-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .gx-alert-section { padding: 3.5rem 6%; }
          .gx-alert-form { padding: 1.5rem; }
          .gx-form-grid { grid-template-columns: 1fr; }
          .gx-zero { padding: 3.5rem 6%; }
        }
        @media (max-width: 540px) {
          .gx-stats { grid-template-columns: 1fr; }
          .gx-currencies { grid-template-columns: repeat(3, 1fr); }
          .gx-hours { grid-template-columns: 1fr; }
          .gx-footer-grid { grid-template-columns: 1fr; }
          .gx-footer-bottom { flex-direction: column; }
        }
      `}</style>

      {/* ── SVG GRADIENTS ── */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="gxLogoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C76E" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#9C7E2E" />
          </linearGradient>
        </defs>
      </svg>

      {/* ── NAV ── */}
      <nav className="gx-nav">
        <a href="/" className="gx-logo" aria-label="Gamaex — Casa de cambio">
          <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(140,140)">
              <circle cx="0" cy="0" r="100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="4" />
              <circle cx="0" cy="0" r="86" fill="none" stroke="url(#gxLogoGold)" strokeWidth="1" opacity="0.5" />
              <path d="M -38 -42 A 50 50 0 1 0 38 42 L 38 0 L 0 0" fill="none" stroke="url(#gxLogoGold)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -7 -100 L 0 -107 L 7 -100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -7 100 L 0 107 L 7 100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="280" y="155" fontFamily="'Cormorant Garamond', serif" fontSize="78" fontWeight="500" letterSpacing="14" fill="url(#gxLogoGold)">GAMAEX</text>
            <text x="280" y="195" fontFamily="'Inter', sans-serif" fontSize="16" fontWeight="400" letterSpacing="6" fill="#9C7E2E">CASA DE CAMBIO · DESDE 1988</text>
          </svg>
        </a>
        <ul className="gx-nav-links">
          <li><a href={navHref(variant, "tasas")}>Tasas</a></li>
          <li><a href={navHref(variant, "servicios")}>Servicios</a></li>
          <li><a href={navHref(variant, "alerta-precio")}>Alerta de precio</a></li>
          <li><a href={navHref(variant, "opiniones")}>Opiniones</a></li>
          <li><a href={navHref(variant, "faq")}>FAQ</a></li>
          <li><a href={navHref(variant, "ubicacion")}>Ubicación</a></li>
        </ul>
        <div className="gx-nav-actions">
          {isOpen !== null && (
            <span className={`gx-status ${isOpen ? "open" : "closed"}`}>
              <span className="dot" />
              {isOpen ? "Abierto ahora" : "Cerrado"}
            </span>
          )}
          <a href={wa()} target="_blank" rel="noopener noreferrer" className="gx-cta-dark" onClick={() => track.whatsappClick("nav")}>
            💬 Cotizar
          </a>
        </div>
      </nav>

      {/* ── PAGE HEADER (variantes != home/full) ── */}
      {showPageHeader && (
        <section className="gx-page-header">
          {variant === "servicios" && (<>
            <span className="gx-label">⚡ Casa de cambio · Providencia</span>
            <h1>Nuestros <em>servicios</em>.</h1>
            <p>Más que cambio de divisas: 40+ monedas, transferencias internacionales, pago a proveedores y atención corporativa. 38 años haciéndolo presencial — sin apps, sin verificaciones eternas.</p>
          </>)}
          {variant === "alerta" && (<>
            <span className="gx-label">🔔 Alerta de precio</span>
            <h1>¿Esperando un <em>precio mejor</em>?</h1>
            <p>Déjanos tu objetivo y te avisamos por WhatsApp cuando el mercado se acerque. Sin costo, sin compromiso de operar.</p>
          </>)}
          {variant === "faq" && (<>
            <span className="gx-label">❓ Preguntas frecuentes</span>
            <h1>Lo que más nos <em>preguntan</em>.</h1>
            <p>Respuestas a las dudas más comunes sobre cambio de divisas, horarios, billetes aceptados y operaciones en Gamaex.</p>
          </>)}
        </section>
      )}

      {/* ── HERO ── */}
      {showHero && (
      <section className="gx-hero">
        <div className="gx-hero-left">
          <span className="gx-hero-tag">⚡ Casa de cambio · Providencia</span>
          <h1>{h1Before}<em>{h1Accent}.</em></h1>
          <p className="lead">{heroDesc}</p>
          <div className="gx-badges">
            <div className="gx-badge"><span className="dot" /> 0% comisiones</div>
            <div className="gx-badge"><span className="dot" /> +40 divisas</div>
            <div className="gx-badge"><span className="dot" /> Atención presencial</div>
            <div className="gx-badge"><span className="dot" /> Sin app, sin registro</div>
            <div className="gx-badge"><span className="dot" /> Desde 1988</div>
          </div>
        </div>

        {/* Calculadora */}
        <div className="gx-converter" id="calculadora">
          <h3>¿Cuánto quieres cambiar hoy?</h3>
          <div className="gx-pairs">
            {[
              { from: "USD", to: "CLP", label: "USD→CLP" },
              { from: "EUR", to: "CLP", label: "EUR→CLP" },
              { from: "BRL", to: "CLP", label: "BRL→CLP" },
              { from: "CLP", to: "USD", label: "CLP→USD" },
            ].map((pair) => {
              const active = fromCurrency === pair.from && toCurrency === pair.to;
              return (
                <button
                  key={pair.label}
                  className={`gx-pair ${active ? "active" : ""}`}
                  onClick={() => { setFromCurrency(pair.from); setToCurrency(pair.to); track.calcUsed(pair.from, pair.to); }}
                >
                  {pair.label}
                </button>
              );
            })}
          </div>

          <div className="gx-conv-row">
            <div style={{ flex: 1 }}>
              <span className="gx-conv-label">Tú entregas</span>
              <input
                className="gx-conv-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="1000"
              />
            </div>
            <select className="gx-conv-select" value={fromCurrency} onChange={(e) => changeFrom(e.target.value)}>
              {selectOptions.map((c) => (
                <option key={c.code} value={c.code}>{c.flag_emoji} {c.code}</option>
              ))}
            </select>
          </div>

          <div className="gx-swap-wrap">
            <button onClick={swap} aria-label="Invertir monedas">⇅</button>
          </div>

          <div className="gx-conv-row">
            <div style={{ flex: 1 }}>
              <span className="gx-conv-label">Tú recibes (aprox.)</span>
              <div className="gx-conv-amount result">
                {hasResult
                  ? result.value.toLocaleString("es-CL", { minimumFractionDigits: result.decimals, maximumFractionDigits: result.decimals })
                  : "—"}
              </div>
            </div>
            <select className="gx-conv-select" value={toCurrency} onChange={(e) => changeTo(e.target.value)}>
              {selectOptions.map((c) => (
                <option key={c.code} value={c.code}>{c.flag_emoji} {c.code}</option>
              ))}
            </select>
          </div>

          {fromRate && toCurrency === "CLP" && (
            <div className="gx-rate-info">
              <span>Tasa de hoy</span>
              <strong>1 {fromCurrency} = ${fromRate.buy.toLocaleString("es-CL")} CLP</strong>
            </div>
          )}

          <a
            href={wa(waCalcMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track.calcWaClick(fromCurrency, toCurrency, numAmount)}
          >
            <button className="gx-cta-gold">💬 Cotizar por WhatsApp →</button>
          </a>

          {hasResult && (
            <button className={`gx-share-btn ${copied ? "copied" : ""}`} onClick={copyShareLink}>
              {copied ? "✓ Enlace copiado" : "🔗 Compartir cotización"}
            </button>
          )}
          <p className="gx-secure-note">🔒 Cotización referencial · Sin comisiones · Atención inmediata</p>
        </div>
      </section>
      )}

      {/* ── TICKER ── */}
      {showTicker && rates.length > 0 && (
        <div className="gx-ticker" aria-hidden="true">
          <div className="gx-ticker-track">
            {[...rates, ...rates].map((r, i) => (
              <div key={`tk-${i}`} className="gx-ticker-item">
                <span>{r.flag_emoji} {r.code}</span>
                <strong>${r.buy.toLocaleString("es-CL", { minimumFractionDigits: r.buy < 1 ? r.decimal_places : 0, maximumFractionDigits: r.buy < 1 ? r.decimal_places : 0 })}</strong>
              </div>
            ))}
            {lastSyncFmt && (
              <div className="gx-ticker-item gx-ticker-meta">
                <span>● Actualizado {lastSyncFmt}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      {showStats && (
      <div className="gx-stats">
        <div className="gx-stat"><h3>38<span>+</span></h3><p>Años de trayectoria</p></div>
        <div className="gx-stat"><h3>40<span>+</span></h3><p>Divisas disponibles</p></div>
        <div className="gx-stat"><h3>0<span>%</span></h3><p>Comisiones ocultas</p></div>
        <div className="gx-stat"><h3>5<span>min</span></h3><p>Operación promedio</p></div>
      </div>
      )}

      {/* ── 3 PASOS ── */}
      {showPasos && (
      <section className="gx-section">
        <p className="gx-label">Cómo funciona</p>
        <h2 className="gx-title">Cambiar divisas en Gamaex,<br />en 3 simples pasos</h2>
        <p className="gx-subtitle">Sin descargar apps. Sin crear cuentas. Sin verificación de identidad eterna. Como casa de cambio de toda la vida — pero con tecnología.</p>
        <div className="gx-steps">
          <div className="gx-step">
            <span className="gx-step-num">1</span>
            <span className="gx-step-icon">💬</span>
            <h4>Cotiza por WhatsApp</h4>
            <p>Escríbenos el monto y la moneda que quieres operar. Te respondemos al instante con el precio exacto del día.</p>
          </div>
          <div className="gx-step">
            <span className="gx-step-num">2</span>
            <span className="gx-step-icon">✅</span>
            <h4>Confirmamos disponibilidad</h4>
            <p>Te confirmamos precio, disponibilidad de billetes y horario de atención. Sin sorpresas al llegar al local.</p>
          </div>
          <div className="gx-step">
            <span className="gx-step-num">3</span>
            <span className="gx-step-icon">🤝</span>
            <h4>Vienes y operas en 5 min</h4>
            <p>Pasas por Pedro de Valdivia 020. Sin filas, atención inmediata. Pagas, recibes tus billetes y listo.</p>
          </div>
        </div>
      </section>
      )}

      {/* ── 40+ DIVISAS ── */}
      {showDivisas && (
      <section className="gx-section gx-section-light">
        <p className="gx-label">Más de 40 monedas</p>
        <h2 className="gx-title">Todas las divisas<br />que necesites — y más</h2>
        <p className="gx-subtitle">No importa de dónde vienes ni a dónde vas. Trabajamos las principales del mundo y muchas que otros no tienen disponibles.</p>
        <div className="gx-currencies">
          {CURRENCY_GRID.map((c) => (
            <div key={c.code} className="gx-currency-chip">
              <span className="flag">{c.flag}</span>
              <span className="code">{c.code}</span>
            </div>
          ))}
        </div>
        <p className="gx-currencies-cta">¿No ves la moneda que buscas? <a href={wa("Hola, ¿trabajan ")} target="_blank" rel="noopener noreferrer" onClick={() => track.whatsappClick("currencies-grid")}>Pregúntanos por WhatsApp →</a></p>
      </section>
      )}

      {/* ── TASAS ── */}
      {showTasas && (
      <section id="tasas" className="gx-section">
        <div className="gx-rates-meta">
          <div>
            <p className="gx-label">Tasas de hoy</p>
            <h2 className="gx-title">Cotizaciones publicadas<br />a diario</h2>
            <p className="gx-subtitle">Precios actualizados diariamente. Confirma valor exacto y disponibilidad por WhatsApp antes de venir.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            {lastSyncFmt && (
              <div style={{ fontSize: "0.85rem", color: "var(--gray)" }}>Última actualización: {lastSyncFmt}</div>
            )}
            {systemStatus === "stale" && (
              <div className="gx-stale-warn">⚠ Precios temporalmente no disponibles — consultar por WhatsApp</div>
            )}
          </div>
        </div>

        <div className="gx-rates-wrap">
          {rates.length === 0 ? (
            <div className="gx-rates-empty">
              Cotizaciones no disponibles en este momento.{" "}
              <a href={wa()} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp →</a>
            </div>
          ) : (
            <table className="gx-rates-table">
              <thead>
                <tr>
                  <th>Divisa</th>
                  <th style={{ textAlign: "right" }}>Compramos (CLP)</th>
                  <th style={{ textAlign: "right" }}>Vendemos (CLP)</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => (
                  <tr
                    key={r.code}
                    className="clickable"
                    onClick={() => {
                      setFromCurrency(r.code);
                      setToCurrency("CLP");
                      track.calcUsed(r.code, "CLP");
                      document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <td>
                      <span className="gx-rate-flag">{r.flag_emoji}</span>
                      <strong>{r.name}</strong> <span style={{ color: "var(--gray)", fontSize: "0.85rem" }}>· {r.code}</span>
                    </td>
                    <td className="gx-rate-buy" style={{ textAlign: "right" }}>
                      ${r.buy.toLocaleString("es-CL", { minimumFractionDigits: r.buy < 1 ? r.decimal_places : 0, maximumFractionDigits: r.buy < 1 ? r.decimal_places : 0 })}
                    </td>
                    <td className="gx-rate-sell" style={{ textAlign: "right" }}>
                      ${r.sell.toLocaleString("es-CL", { minimumFractionDigits: r.sell < 1 ? r.decimal_places : 0, maximumFractionDigits: r.sell < 1 ? r.decimal_places : 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="gx-rates-foot">Cotización orientativa. Para confirmar precio y operar, consúltenos directamente.</p>
      </section>
      )}

      {/* ── SERVICIOS ── */}
      {showServicios && (
      <section id="servicios" className="gx-section gx-section-light">
        <p className="gx-label">Qué hacemos</p>
        <h2 className="gx-title">Todo lo que necesitas<br />en un solo lugar</h2>
        <p className="gx-subtitle">Más que cambio de divisas: somos tu socio financiero para operaciones en moneda extranjera.</p>
        <div className="gx-services">
          <div className="gx-service">
            <div className="gx-service-icon">💱</div>
            <h4>Cambio de Divisas</h4>
            <p>Más de 40 monedas disponibles al mejor tipo de cambio del mercado. Precios publicados, sin comisiones.</p>
          </div>
          <div className="gx-service">
            <div className="gx-service-icon">🌍</div>
            <h4>Transferencias Internacionales</h4>
            <p>Envío y recepción de fondos al exterior. Asesoría personalizada para cada operación.</p>
          </div>
          <div className="gx-service">
            <div className="gx-service-icon">🏢</div>
            <h4>Pago a Proveedores</h4>
            <p>Para empresas que operan o pagan en moneda extranjera. Condiciones especiales por volumen.</p>
          </div>
          <div className="gx-service">
            <div className="gx-service-icon">⭐</div>
            <h4>Atención Preferencial</h4>
            <p>Oficinas privadas para operaciones de mayor monto. Discreción total y trato personalizado.</p>
          </div>
        </div>
      </section>
      )}

      {/* ── 0% ── */}
      {showZero && (
      <section className="gx-zero">
        <p className="gx-label">Tarifas transparentes</p>
        <div className="big">0<span>%</span></div>
        <h3>Cero comisiones. Cero letra chica.</h3>
        <p>El precio que ves es el precio que pagas. Sin recargos, sin spreads escondidos, sin sorpresas al final. La forma honesta de cambiar divisas — como debe ser.</p>
      </section>
      )}

      {/* ── PRESENCIAL VS APPS ── */}
      {showVs && (
      <section className="gx-section">
        <p className="gx-label">Presencial vs Apps</p>
        <h2 className="gx-title">¿Cansado de descargar apps<br />para cambiar plata?</h2>
        <p className="gx-subtitle">Las apps tienen su lugar, pero para cambiar divisas la forma más rápida sigue siendo venir, mostrar tus billetes y operar cara a cara. Sin pasos extra.</p>
        <div className="gx-vs">
          <div className="gx-vs-card them">
            <h4>Apps de remesas</h4>
            <ul className="gx-vs-list">
              <li><span className="x">✕</span> Descarga app + crea cuenta</li>
              <li><span className="x">✕</span> Verificación de identidad (24-72h)</li>
              <li><span className="x">✕</span> Sube documentos, selfie, comprobantes</li>
              <li><span className="x">✕</span> Esperas que aprueben tu cuenta</li>
              <li><span className="x">✕</span> Esperas que llegue el envío (1-3 días)</li>
              <li><span className="x">✕</span> Atención por chat con bot</li>
              <li><span className="x">✕</span> Comisiones desde 1.3%</li>
            </ul>
          </div>
          <div className="gx-vs-card us">
            <h4>Gamaex (presencial)</h4>
            <ul className="gx-vs-list">
              <li><span className="check">✓</span> WhatsApp directo, sin descargas</li>
              <li><span className="check">✓</span> Sin verificación de identidad</li>
              <li><span className="check">✓</span> Sin papeles, sin selfies</li>
              <li><span className="check">✓</span> Vienes y operas el mismo día</li>
              <li><span className="check">✓</span> Recibes tus billetes en mano, en 5 min</li>
              <li><span className="check">✓</span> Atención humana de un equipo con 38 años</li>
              <li><span className="check">✓</span> 0% comisiones, precio final</li>
            </ul>
          </div>
        </div>
      </section>
      )}

      {/* ── VIDEO LOCAL ── */}
      {showVideo && (
      <section id="local" className="gx-section gx-section-light" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <p className="gx-label">Casa de cambio · Providencia</p>
        <h2 className="gx-title">Conoce nuestro local</h2>
        <p className="gx-subtitle">Una casa de cambio familiar en el corazón de Providencia. Atención directa, sin intermediarios ni burocracia.</p>
        <div className="gx-video-wrap">
          <video src="/local.mp4" autoPlay muted loop playsInline preload="metadata" />
        </div>
      </section>
      )}

      {/* ── ALERTA DE PRECIO ── */}
      {showAlerta && (
      <section id="alerta-precio" className="gx-alert-section">
        <p className="gx-label">Avísame cuando llegue mi precio</p>
        <h2 className="gx-title">¿No te conviene la tasa de hoy?<br />Te llamamos cuando suba o baje.</h2>
        <p className="gx-subtitle">Déjanos tu precio objetivo y te contactamos por WhatsApp cuando el mercado se acerque a ese valor. Sin compromiso.</p>

        <div className="gx-alert-grid">
          <div className="gx-alert-info">
            <h3>Cómo funciona</h3>
            <div className="gx-alert-step">
              <div className="gx-alert-step-num">1</div>
              <div><strong>Eliges tu moneda y precio objetivo</strong><span>Ej: &ldquo;Avísenme cuando el dólar baje a $890&rdquo;</span></div>
            </div>
            <div className="gx-alert-step">
              <div className="gx-alert-step-num">2</div>
              <div><strong>Nuestro equipo monitorea el mercado</strong><span>En cuanto la tasa se acerque a tu objetivo, recibirás un mensaje en tu WhatsApp.</span></div>
            </div>
            <div className="gx-alert-step">
              <div className="gx-alert-step-num">3</div>
              <div><strong>Confirmas y operas</strong><span>Sin compromiso de compra. Tú decides si la operación se concreta.</span></div>
            </div>
          </div>

          <div className="gx-alert-form">
            {alertSuccess ? (
              <div className="gx-success">
                <div className="gx-success-icon">✓</div>
                <h3>Solicitud recibida</h3>
                <p>Te contactaremos por WhatsApp cuando el precio se acerque a tu objetivo. Recuerda que esto no garantiza precio ni disponibilidad — la operación se confirma directamente con nuestro equipo.</p>
                <button
                  className="gx-success-btn"
                  onClick={() => { setAlertSuccess(false); setAlertName(""); setAlertWhatsapp(""); setAlertPrice(""); setAlertAmount(""); setAlertComment(""); }}
                >
                  Crear otra alerta
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { void submitAlert(e); }}>
                <h4>Crea tu alerta de precio</h4>
                <p className="sub">Recibirás un mensaje cuando el precio se acerque a tu objetivo. Sin costo, sin compromiso.</p>
                <div className="gx-form-grid">
                  <div className="gx-form-field">
                    <label>Tu nombre *</label>
                    <input type="text" value={alertName} onChange={(e) => setAlertName(e.target.value)} placeholder="Juan Pérez" required maxLength={80} />
                  </div>
                  <div className="gx-form-field">
                    <label>WhatsApp *</label>
                    <input type="tel" value={alertWhatsapp} onChange={(e) => setAlertWhatsapp(e.target.value)} placeholder="+56 9 1234 5678" required />
                  </div>
                  <div className="gx-form-field">
                    <label>Moneda *</label>
                    <select value={alertCurrency} onChange={(e) => setAlertCurrency(e.target.value)} required>
                      {rates.map((r) => (
                        <option key={r.code} value={r.code}>{r.flag_emoji} {r.name} ({r.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="gx-form-field">
                    <label>Operación *</label>
                    <div className="gx-op-toggle">
                      <button type="button" className={alertOperation === "BUY" ? "active" : ""} onClick={() => setAlertOperation("BUY")}>Comprar</button>
                      <button type="button" className={alertOperation === "SELL" ? "active" : ""} onClick={() => setAlertOperation("SELL")}>Vender</button>
                    </div>
                  </div>
                  <div className="gx-form-field">
                    <label>Precio objetivo CLP *</label>
                    <input type="number" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} placeholder="890" required min={1} step={1} />
                    {alertRate && (
                      <div className="gx-current-rate">
                        Hoy — Compramos: <span className="buy">${alertRate.buy.toLocaleString("es-CL")}</span> · Vendemos: <span className="sell">${alertRate.sell.toLocaleString("es-CL")}</span>
                      </div>
                    )}
                  </div>
                  <div className="gx-form-field">
                    <label>Monto aprox. (opcional)</label>
                    <input type="number" value={alertAmount} onChange={(e) => setAlertAmount(e.target.value)} placeholder="1000" min={0} step={1} />
                  </div>
                  <div className="gx-form-field gx-form-full">
                    <label>Comentario (opcional)</label>
                    <textarea value={alertComment} onChange={(e) => setAlertComment(e.target.value)} placeholder="Cualquier dato adicional que sea útil..." maxLength={200} />
                  </div>
                  <div className="gx-form-full">
                    {alertError && <p className="gx-form-error">{alertError}</p>}
                    <button type="submit" className="gx-cta-gold" disabled={alertLoading} style={{ marginTop: "0.5rem" }}>
                      {alertLoading ? "Enviando..." : "🔔 Crear alerta de precio →"}
                    </button>
                    <p className="gx-form-disclaimer">Esta solicitud es solo referencial. Gamaex no garantiza precio, no bloquea tasa ni reserva moneda. El contacto depende de la disponibilidad y las condiciones del mercado al momento.</p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ── TESTIMONIALES ── */}
      {showOpiniones && (
      <section id="opiniones" className="gx-section">
        <p className="gx-label">Opiniones reales</p>
        <h2 className="gx-title">Lo que dicen nuestros clientes</h2>
        <p className="gx-subtitle">Reseñas verificadas en Google Maps · Calificación 5.0 ★</p>
        <div className="gx-testimonials">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="gx-testimonial">
              <div className="gx-stars">★ ★ ★ ★ ★</div>
              <p className="gx-testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="gx-testimonial-author">
                <div className="gx-avatar">{t.initial}</div>
                <div>
                  <p>{t.name}</p>
                  <span>{t.context}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── FAQ ── */}
      {showFaq && (
      <section id="faq" className="gx-section">
        <p className="gx-label">Preguntas frecuentes</p>
        <h2 className="gx-title">Lo que más nos preguntan</h2>
        <div className="gx-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`gx-faq-item ${openFaq === i ? "open" : ""}`}>
              <button
                className="gx-faq-q"
                onClick={() => { const next = openFaq === i ? null : i; setOpenFaq(next); if (next === i) track.faqOpen(item.q); }}
                aria-expanded={openFaq === i}
              >
                <span>{item.q}</span>
                <span className="gx-faq-icon">+</span>
              </button>
              <div className="gx-faq-a"><p>{item.a}</p></div>
            </div>
          ))}
        </div>
        <div className="gx-faq-cta">
          <p>¿Tienes otra pregunta? Escribinos directamente.</p>
          <a href={wa("Hola, tengo una consulta sobre el servicio de Gamaex.")} target="_blank" rel="noopener noreferrer" onClick={() => track.whatsappClick("faq")}>
            <button className="gx-cta-dark">💬 Consultar por WhatsApp</button>
          </a>
        </div>
      </section>
      )}

      {/* ── ARTICLE (opcional) ── */}
      {pageContext?.articleText && (
        <section className="gx-article">
          <p>{pageContext.articleText}</p>
        </section>
      )}

      {/* ── UBICACIÓN ── */}
      {showUbicacion && (
      <section id="ubicacion" className="gx-section gx-section-light">
        <p className="gx-label">Ven a vernos</p>
        <h2 className="gx-title">Av. Pedro de Valdivia 020,<br />Providencia</h2>
        <p className="gx-subtitle">A pasos del Metro Pedro de Valdivia (Línea 1). Atención presencial sin reserva.</p>

        <div className="gx-loc-grid">
          <div>
            <div className="gx-loc-info-row">
              <div className="gx-loc-icon">📍</div>
              <div><strong>Dirección</strong><span>Av. Pedro de Valdivia 020, Providencia, Santiago</span></div>
            </div>
            <div className="gx-loc-info-row">
              <div className="gx-loc-icon">🚇</div>
              <div><strong>Metro</strong><span>Pedro de Valdivia · Línea 1 (a 50 metros)</span></div>
            </div>
            <div className="gx-loc-info-row">
              <div className="gx-loc-icon">📞</div>
              <div><strong>Teléfono</strong><span>{FIXED_PHONE}</span></div>
            </div>
            <div className="gx-loc-info-row">
              <div className="gx-loc-icon">💬</div>
              <div><strong>WhatsApp</strong><span>+56 9 3878 2514</span></div>
            </div>

            <div className="gx-hours">
              <div className="gx-hour-card">
                <div className="day">Lun – Vie</div>
                <div className="time">9:00 — 17:00</div>
              </div>
              <div className="gx-hour-card">
                <div className="day">Sábado</div>
                <div className="time">9:00 — 13:00</div>
              </div>
              <div className="gx-hour-card">
                <div className="day">Domingo</div>
                <div className="time closed">Cerrado</div>
              </div>
            </div>

            <div className="gx-loc-cta">
              <a
                href="https://maps.google.com/?q=Av.+Pedro+de+Valdivia+020,+Providencia,+Santiago,+Chile"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track.mapsClick()}
                className="gx-cta-outline"
              >
                📍 Ver en Maps
              </a>
              <a href={wa()} target="_blank" rel="noopener noreferrer" onClick={() => track.whatsappClick("ubicacion")}>
                <button className="gx-cta-dark">💬 Cotizar ahora</button>
              </a>
              <a href={`tel:${FIXED_PHONE.replace(/\s/g, "")}`} onClick={() => track.phoneClick()} className="gx-cta-outline">
                📞 Llamar
              </a>
            </div>
          </div>

          <div className="gx-map-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!4v1776977116640!6m8!1m7!1sHiOUKwxtkdhLltTGtazSxA!2m2!1d-33.4232948606249!2d-70.6126826154358!3f219.86831397446946!4f0.2564110419943262!5f1.8039058824642895"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gamaex Chile — Av. Pedro de Valdivia 020, Providencia"
              allowFullScreen
            />
          </div>
        </div>
      </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="gx-footer">
        <div className="gx-footer-grid">
          <div className="gx-footer-brand">
            <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(140,140)">
                <circle cx="0" cy="0" r="100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="4" />
                <circle cx="0" cy="0" r="86" fill="none" stroke="url(#gxLogoGold)" strokeWidth="1" opacity="0.5" />
                <path d="M -38 -42 A 50 50 0 1 0 38 42 L 38 0 L 0 0" fill="none" stroke="url(#gxLogoGold)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M -7 -100 L 0 -107 L 7 -100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M -7 100 L 0 107 L 7 100" fill="none" stroke="url(#gxLogoGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <text x="280" y="155" fontFamily="'Cormorant Garamond', serif" fontSize="78" fontWeight="500" letterSpacing="14" fill="url(#gxLogoGold)">GAMAEX</text>
              <text x="280" y="195" fontFamily="'Inter', sans-serif" fontSize="16" fontWeight="400" letterSpacing="6" fill="#C9A84C">CASA DE CAMBIO · DESDE 1988</text>
            </svg>
            <p>38 años brindando el mejor tipo de cambio en Santiago. Casa de cambio en Providencia, a pasos del Metro Pedro de Valdivia.</p>
          </div>
          <div className="gx-footer-col">
            <h5>Servicios</h5>
            <ul>
              <li><a href={navHref(variant, "servicios")}>Cambio de divisas</a></li>
              <li><a href={navHref(variant, "servicios")}>Transferencias</a></li>
              <li><a href={navHref(variant, "servicios")}>Pago a proveedores</a></li>
              <li><a href={navHref(variant, "servicios")}>Atención corporativa</a></li>
            </ul>
          </div>
          <div className="gx-footer-col">
            <h5>Información</h5>
            <ul>
              <li><a href={navHref(variant, "tasas")}>Tasas de hoy</a></li>
              <li><a href={navHref(variant, "alerta-precio")}>Alerta de precio</a></li>
              <li><a href={navHref(variant, "opiniones")}>Opiniones</a></li>
              <li><a href={navHref(variant, "faq")}>FAQ</a></li>
              <li><a href={navHref(variant, "ubicacion")}>Cómo llegar</a></li>
            </ul>
          </div>
          <div className="gx-footer-col">
            <h5>Contacto</h5>
            <ul>
              <li><a href={wa()} target="_blank" rel="noopener noreferrer">WhatsApp +56 9 3878 2514</a></li>
              <li><a href={`tel:${FIXED_PHONE.replace(/\s/g, "")}`}>{FIXED_PHONE}</a></li>
              <li><a href="mailto:gamaex@gmail.com">gamaex@gmail.com</a></li>
              <li><span className="staticline">Lun–Vie 9:00–17:00 · Sáb 9:00–13:00</span></li>
            </ul>
          </div>
        </div>
        <div className="gx-footer-bottom">
          <span>© {new Date().getFullYear()} Gamaex Chile · Inversiones y Turismo Gamaex Chile S.A.</span>
          <span>Av. Pedro de Valdivia 020, Providencia, Santiago</span>
        </div>
      </footer>

      {/* ── FLOAT WHATSAPP ── */}
      <a
        href={wa()}
        target="_blank"
        rel="noopener noreferrer"
        className="gx-wa-float"
        onClick={() => track.whatsappClick("floating")}
        title="Cotizar por WhatsApp"
        aria-label="Consultar por WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
