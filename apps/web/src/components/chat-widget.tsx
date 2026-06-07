"use client";

import { useEffect, useRef, useState } from "react";
import { track, trackEvent } from "./analytics";

const WA_NUMBER = "56938782514";
const SS_KEY = "gx_chat_nudged";

type Step = "greet" | "currency" | "operation" | "amount" | "handoff";
type Operation = "compro" | "vendo";

const CURRENCIES = ["USD", "EUR", "BRL", "GBP", "ARS", "Otra"] as const;

type Message = {
  who: "bot" | "user";
  text: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [step, setStep] = useState<Step>("greet");
  const [messages, setMessages] = useState<Message[]>([
    { who: "bot", text: "¡Hola! 👋 Soy el asistente de Gamaex." },
    { who: "bot", text: "¿Quieres cotizar una operación de cambio? Te derivo a un asesor humano por WhatsApp." },
  ]);
  const [currency, setCurrency] = useState<string>("");
  const [operation, setOperation] = useState<Operation | "">("");
  const [amount, setAmount] = useState("");
  const [customCurrency, setCustomCurrency] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Nudge: aparece tras 3.5s, solo 1 vez por sesión
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SS_KEY)) return;
    const t = setTimeout(() => {
      if (!open) setNudge(true);
    }, 3500);
    return () => clearTimeout(t);
  }, [open]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step, open]);

  const openChat = () => {
    setOpen(true);
    setNudge(false);
    if (typeof window !== "undefined") sessionStorage.setItem(SS_KEY, "1");
    trackEvent("chat_open", "engagement", "widget");
  };

  const closeChat = () => setOpen(false);

  const closeNudge = () => {
    setNudge(false);
    if (typeof window !== "undefined") sessionStorage.setItem(SS_KEY, "1");
  };

  const pushBot = (text: string) =>
    setMessages((m) => [...m, { who: "bot", text }]);
  const pushUser = (text: string) =>
    setMessages((m) => [...m, { who: "user", text }]);

  const startCotizar = () => {
    pushUser("Sí, quiero cotizar");
    pushBot("Excelente. ¿Qué moneda te interesa?");
    setStep("currency");
    trackEvent("chat_step", "engagement", "currency");
  };

  const declineCotizar = () => {
    pushUser("Solo estoy mirando");
    pushBot("Sin problema. Si necesitas algo, escríbenos por WhatsApp cuando quieras 👋");
    setStep("handoff");
  };

  const pickCurrency = (c: string) => {
    if (c === "Otra") {
      pushUser("Otra moneda");
      pushBot("Cuéntame qué moneda. Escribe el código o nombre (ej: CHF, yen japonés).");
      setStep("currency");
      return;
    }
    setCurrency(c);
    pushUser(c);
    pushBot("¿Quieres comprar o vender esa moneda?");
    setStep("operation");
    trackEvent("chat_step", "engagement", "operation");
  };

  const submitCustomCurrency = () => {
    const c = customCurrency.trim();
    if (!c) return;
    setCurrency(c);
    pushUser(c);
    pushBot("¿Quieres comprar o vender esa moneda?");
    setStep("operation");
    trackEvent("chat_step", "engagement", "operation");
  };

  const pickOperation = (op: Operation) => {
    setOperation(op);
    pushUser(op === "compro" ? "Comprar" : "Vender");
    pushBot(`¿Qué monto aproximado en ${currency}? (puede ser estimativo)`);
    setStep("amount");
    trackEvent("chat_step", "engagement", "amount");
  };

  const submitAmount = () => {
    const a = amount.trim();
    if (!a) return;
    pushUser(a);
    pushBot("Perfecto. Te paso a WhatsApp con todos los datos para que un asesor te confirme el precio del día.");
    setStep("handoff");
    trackEvent("chat_step", "engagement", "handoff");
  };

  const buildWaMessage = () => {
    if (step === "handoff" && operation && currency && amount) {
      return `Hola, vengo desde la web de Gamaex. Quiero ${operation === "compro" ? "comprar" : "vender"} aprox. ${amount} ${currency}. ¿Me confirman precio del día?`;
    }
    return "Hola, vengo desde la web de Gamaex. Quiero consultar una cotización.";
  };

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaMessage())}`;

  const handleWaClick = () => {
    track.whatsappClick(`chat-widget-${step}`);
  };

  return (
    <>
      {/* NUDGE BUBBLE */}
      {nudge && !open && (
        <div className="gxchat-nudge" role="dialog" aria-label="Mensaje de bienvenida">
          <button className="gxchat-nudge-close" onClick={closeNudge} aria-label="Cerrar">×</button>
          <button className="gxchat-nudge-body" onClick={openChat}>
            <span className="gxchat-nudge-emoji">👋</span>
            <span>¡Hola! ¿Quieres cotizar?</span>
          </button>
        </div>
      )}

      {/* FLOATING BUTTON */}
      {!open && (
        <button className="gxchat-fab" onClick={openChat} aria-label="Abrir chat">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="gxchat-fab-dot" aria-hidden="true" />
        </button>
      )}

      {/* CHAT PANEL */}
      {open && (
        <div className="gxchat-panel" role="dialog" aria-label="Chat de Gamaex">
          <header className="gxchat-head">
            <div className="gxchat-head-info">
              <div className="gxchat-avatar">G</div>
              <div>
                <strong>Gamaex</strong>
                <span>Casa de cambio · Providencia</span>
              </div>
            </div>
            <button className="gxchat-close" onClick={closeChat} aria-label="Cerrar chat">×</button>
          </header>

          <div className="gxchat-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`gxchat-msg ${m.who}`}>
                <div className="gxchat-bubble">{m.text}</div>
              </div>
            ))}

            {/* QUICK REPLIES por step */}
            {step === "greet" && (
              <div className="gxchat-quick">
                <button onClick={startCotizar}>💬 Sí, cotizar</button>
                <button onClick={declineCotizar} className="ghost">Solo miro</button>
              </div>
            )}

            {step === "currency" && !currency && (
              <div className="gxchat-quick wrap">
                {CURRENCIES.map((c) => (
                  <button key={c} onClick={() => pickCurrency(c)}>{c}</button>
                ))}
              </div>
            )}

            {step === "currency" && messages[messages.length - 1]?.text.includes("Escribe el código") && (
              <div className="gxchat-input-row">
                <input
                  type="text"
                  placeholder="Ej: CHF, yen, franco suizo..."
                  value={customCurrency}
                  onChange={(e) => setCustomCurrency(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitCustomCurrency(); }}
                  autoFocus
                />
                <button onClick={submitCustomCurrency}>OK</button>
              </div>
            )}

            {step === "operation" && (
              <div className="gxchat-quick">
                <button onClick={() => pickOperation("compro")}>Comprar {currency}</button>
                <button onClick={() => pickOperation("vendo")}>Vender {currency}</button>
              </div>
            )}

            {step === "amount" && (
              <div className="gxchat-input-row">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={`Monto aprox. en ${currency}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitAmount(); }}
                  autoFocus
                />
                <button onClick={submitAmount}>Enviar</button>
              </div>
            )}
          </div>

          {/* FOOTER siempre con CTA WhatsApp */}
          <a
            className="gxchat-wa-cta"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWaClick}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1s-1.3-.5-2.4-1.5c-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>
            {step === "handoff" ? "Continuar en WhatsApp" : "Hablar con un asesor"}
          </a>

          <div className="gxchat-disclaimer">
            El precio final lo confirma siempre un asesor humano.
          </div>
        </div>
      )}

      <style>{`
        :root {
          --gxc-gold: #C9A84C;
          --gxc-gold-deep: #9C7E2E;
          --gxc-gold-light: #E8C76E;
          --gxc-dark: #0F1419;
          --gxc-light: #FAF8F2;
          --gxc-border: #E8E4D6;
          --gxc-gray: #6B7280;
          --gxc-wa: #25D366;
        }

        /* FAB */
        .gxchat-fab {
          position: fixed; bottom: 20px; right: 20px; z-index: 9998;
          width: 60px; height: 60px; border-radius: 50%;
          background: var(--gxc-dark); color: var(--gxc-gold-light);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 30px rgba(15,20,25,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .gxchat-fab:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(15,20,25,0.45); }
        .gxchat-fab-dot {
          position: absolute; top: 8px; right: 8px;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--gxc-gold); border: 2px solid var(--gxc-dark);
          animation: gxc-pulse 2s infinite;
        }
        @keyframes gxc-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        /* NUDGE */
        .gxchat-nudge {
          position: fixed; bottom: 92px; right: 20px; z-index: 9997;
          background: white; border: 1px solid var(--gxc-border);
          border-radius: 16px; padding: 0;
          box-shadow: 0 14px 36px rgba(15,20,25,0.18);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 240px;
          animation: gxc-slidein 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes gxc-slidein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .gxchat-nudge-body {
          background: transparent; border: none; cursor: pointer;
          padding: 14px 36px 14px 16px;
          display: flex; align-items: center; gap: 10px;
          font-family: inherit; font-size: 0.95rem; font-weight: 600;
          color: var(--gxc-dark); text-align: left;
          width: 100%;
        }
        .gxchat-nudge-emoji { font-size: 1.3rem; }
        .gxchat-nudge-close {
          position: absolute; top: 6px; right: 8px;
          width: 24px; height: 24px; border-radius: 50%;
          background: transparent; border: none; cursor: pointer;
          color: var(--gxc-gray); font-size: 1.2rem; line-height: 1;
        }
        .gxchat-nudge-close:hover { color: var(--gxc-dark); background: var(--gxc-light); }

        /* PANEL */
        .gxchat-panel {
          position: fixed; bottom: 20px; right: 20px; z-index: 9999;
          width: 360px; max-width: calc(100vw - 32px);
          height: 540px; max-height: calc(100vh - 40px);
          background: white; border-radius: 18px;
          box-shadow: 0 22px 60px rgba(15,20,25,0.32);
          display: flex; flex-direction: column;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          animation: gxc-slidein 0.3s cubic-bezier(0.22,1,0.36,1);
        }

        .gxchat-head {
          background: var(--gxc-dark); color: white;
          padding: 14px 16px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .gxchat-head-info { display: flex; align-items: center; gap: 12px; }
        .gxchat-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, var(--gxc-gold-light), var(--gxc-gold-deep));
          color: var(--gxc-dark); font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.05rem;
        }
        .gxchat-head-info strong { display: block; font-size: 0.95rem; }
        .gxchat-head-info span { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.65); }
        .gxchat-close {
          background: transparent; border: none; cursor: pointer;
          color: white; font-size: 1.4rem; line-height: 1;
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .gxchat-close:hover { background: rgba(255,255,255,0.1); }

        /* BODY */
        .gxchat-body {
          flex: 1; overflow-y: auto;
          padding: 16px; background: var(--gxc-light);
          display: flex; flex-direction: column; gap: 10px;
        }
        .gxchat-msg { display: flex; max-width: 85%; }
        .gxchat-msg.bot { align-self: flex-start; }
        .gxchat-msg.user { align-self: flex-end; }
        .gxchat-bubble {
          padding: 10px 14px; border-radius: 14px;
          font-size: 0.92rem; line-height: 1.45;
        }
        .gxchat-msg.bot .gxchat-bubble {
          background: white; color: var(--gxc-dark);
          border: 1px solid var(--gxc-border);
          border-bottom-left-radius: 4px;
        }
        .gxchat-msg.user .gxchat-bubble {
          background: var(--gxc-dark); color: white;
          border-bottom-right-radius: 4px;
        }

        /* QUICK REPLIES */
        .gxchat-quick {
          display: flex; gap: 8px; margin-top: 6px;
          align-self: flex-start; max-width: 100%;
        }
        .gxchat-quick.wrap { flex-wrap: wrap; }
        .gxchat-quick button {
          background: white; color: var(--gxc-dark);
          border: 1.5px solid var(--gxc-border);
          padding: 9px 14px; border-radius: 50px;
          font-size: 0.86rem; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
          font-family: inherit;
        }
        .gxchat-quick button:hover {
          border-color: var(--gxc-gold);
          background: rgba(201,168,76,0.08);
        }
        .gxchat-quick button.ghost {
          color: var(--gxc-gray);
        }

        /* INPUT ROW */
        .gxchat-input-row {
          display: flex; gap: 6px; margin-top: 6px;
          align-self: stretch;
        }
        .gxchat-input-row input {
          flex: 1; padding: 10px 14px;
          border: 1.5px solid var(--gxc-border); border-radius: 12px;
          font-size: 0.92rem; font-family: inherit;
          background: white; color: var(--gxc-dark); outline: none;
        }
        .gxchat-input-row input:focus { border-color: var(--gxc-gold); }
        .gxchat-input-row button {
          background: var(--gxc-dark); color: white;
          border: none; padding: 0 16px; border-radius: 12px;
          font-size: 0.88rem; font-weight: 600; cursor: pointer;
          font-family: inherit;
        }
        .gxchat-input-row button:hover { background: #1A1F26; }

        /* WA CTA */
        .gxchat-wa-cta {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--gxc-wa); color: white !important;
          padding: 14px; font-weight: 700; font-size: 0.95rem;
          text-decoration: none; transition: background 0.15s;
        }
        .gxchat-wa-cta:hover { background: #1FB857; }

        .gxchat-disclaimer {
          background: white; color: var(--gxc-gray);
          padding: 8px 14px; font-size: 0.72rem; text-align: center;
          border-top: 1px solid var(--gxc-border);
        }

        @media (max-width: 480px) {
          .gxchat-panel {
            width: calc(100vw - 24px); right: 12px; bottom: 12px;
            height: calc(100vh - 24px); max-height: 600px;
          }
          .gxchat-fab { width: 56px; height: 56px; bottom: 16px; right: 16px; }
          .gxchat-nudge { bottom: 84px; right: 16px; }
        }
      `}</style>
    </>
  );
}
