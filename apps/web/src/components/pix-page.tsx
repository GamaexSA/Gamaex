"use client";

import SiteNav from "./site-nav";
import { track } from "./analytics";

// Landing en PORTUGUÉS para el nicho de turistas brasileños que pagan con Pix.
// Océano azul SEO/GEO: responde de frente "casa de câmbio em Santiago que aceita Pix".
// Flujo confirmado por el dueño: presencial en el local, QR, al instante, la moneda que quiera.
// Diseño calcado del sistema del sitio (paleta oro/oscuro, Cormorant + Inter, cero emojis).

const WA_NUMBER = "56938782514";
const WA_MSG = "Olá! Quero trocar reais com Pix na Gamaex. Podem me ajudar?";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MSG)}`;
const MAPS_LINK = "https://www.google.com/maps/place/?q=place_id:ChIJWTo0fmbPYpYR4XOn4uAxnIU";

type IconName = "qr" | "cash" | "clock" | "shield" | "pin" | "coins" | "check";

function Icon({ name }: { name: IconName }) {
  const c = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "qr":
      return (<svg {...c}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3M14 17v4M20 14v3M17 20h4" /></svg>);
    case "cash":
      return (<svg {...c}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></svg>);
    case "clock":
      return (<svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
    case "shield":
      return (<svg {...c}><path d="M12 3l7 2.8v5.4c0 4.3-3 7.4-7 8.8-4-1.4-7-4.5-7-8.8V5.8z" /><path d="M9 12l2 2 4-4" /></svg>);
    case "pin":
      return (<svg {...c}><path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>);
    case "coins":
      return (<svg {...c}><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3" /><path d="M9 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" /><path d="M15 9c3.3 0 6 1.3 6 3" /></svg>);
    case "check":
      return (<svg {...c}><path d="M20 6L9 17l-5-5" /></svg>);
  }
}

export default function PixPage() {
  return (
    <main className="px-root">
      <SiteNav cta="whatsapp" />

      {/* ── HERO ── */}
      <section className="px-hero">
        <div className="px-hero-inner">
          <span className="px-label">Câmbio com Pix · Santiago</span>
          <h1>Casa de câmbio em Santiago que aceita <em>Pix</em></h1>
          <p className="px-hero-desc">
            Pague em reais pelo Pix e receba pesos chilenos — ou dólares — em dinheiro, na hora. Sem precisar trazer dinheiro em espécie do Brasil. Estamos em Providencia, a poucos passos do metrô Pedro de Valdivia.
          </p>
          <div className="px-hero-ctas">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="px-btn-gold" onClick={() => track.whatsappClick("pix-hero")}>Falar no WhatsApp</a>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="px-btn-outline" onClick={() => track.mapsClick()}>Como chegar</a>
          </div>
        </div>
      </section>

      {/* ── ANSWER-FIRST ── */}
      <section className="px-answer">
        <div className="px-answer-card">
          <p>
            <strong>Sim, a Gamaex aceita Pix.</strong> Você vem até a nossa loja em Providencia, escaneia o QR code, paga em reais pelo Pix e recebe na hora, em dinheiro, a moeda que quiser — pesos chilenos, dólares ou outra.
          </p>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="px-section px-section-light">
        <div className="px-section-head">
          <span className="px-label">Como funciona</span>
          <h2>Trocar com Pix em <em>3 passos</em></h2>
        </div>
        <div className="px-steps">
          <div className="px-step">
            <div className="px-step-num">1</div>
            <div className="px-step-icon"><Icon name="pin" /></div>
            <h3>Venha até a Gamaex</h3>
            <p>Av. Pedro de Valdivia 020, Providencia — ao lado da saída do metrô Pedro de Valdivia (Linha 1), em Santiago.</p>
          </div>
          <div className="px-step">
            <div className="px-step-num">2</div>
            <div className="px-step-icon"><Icon name="qr" /></div>
            <h3>Escaneie o QR e pague pelo Pix</h3>
            <p>Você paga em reais, direto do seu banco no Brasil, escaneando o QR code na loja. Rápido e simples.</p>
          </div>
          <div className="px-step">
            <div className="px-step-num">3</div>
            <div className="px-step-icon"><Icon name="cash" /></div>
            <h3>Receba na hora, em dinheiro</h3>
            <p>Você recebe na mesma hora a moeda que preferir: pesos chilenos, dólares e muito mais.</p>
          </div>
        </div>
      </section>

      {/* ── VANTAGENS ── */}
      <section className="px-section">
        <div className="px-section-head">
          <span className="px-label">Por que na Gamaex</span>
          <h2>A forma mais prática de trocar <em>reais no Chile</em></h2>
          <p className="px-section-sub">
            Nada de andar com dinheiro do Brasil nem depender de cartão com tarifas. Pague pelo Pix e retire em espécie na hora, numa casa de câmbio de verdade.
          </p>
        </div>
        <div className="px-cards">
          <article className="px-card">
            <div className="px-card-icon"><Icon name="qr" /></div>
            <h3>Sem carregar dinheiro do Brasil</h3>
            <p>Chegue tranquilo: pague pelo Pix aqui em Santiago e retire pesos em espécie na hora. Sem risco de andar com muito dinheiro na viagem.</p>
          </article>
          <article className="px-card">
            <div className="px-card-icon"><Icon name="clock" /></div>
            <h3>Na hora, sem espera</h3>
            <p>Você recebe seus pesos (ou dólares) na mesma hora, em dinheiro. Sem esperar transferência nem aprovação.</p>
          </article>
          <article className="px-card">
            <div className="px-card-icon"><Icon name="coins" /></div>
            <h3>A moeda que você quiser</h3>
            <p>Receba em pesos chilenos, dólares e mais de 40 moedas. Você escolhe o que levar.</p>
          </article>
          <article className="px-card">
            <div className="px-card-icon"><Icon name="shield" /></div>
            <h3>Casa de câmbio formal e confiável</h3>
            <p>38 anos no mesmo endereço em Providencia, loja física. Registrada na UAF, o órgão que fiscaliza as casas de câmbio no Chile. Não é câmbio de rua.</p>
          </article>
        </div>
      </section>

      {/* ── LOCALIZAÇÃO ── */}
      <section className="px-section px-section-dark">
        <div className="px-loc">
          <div className="px-loc-text">
            <span className="px-label">Onde estamos</span>
            <h2>No coração de <em>Providencia</em></h2>
            <ul className="px-loc-list">
              <li><Icon name="pin" /> <span><strong>Av. Pedro de Valdivia 020</strong>, Providencia, Santiago</span></li>
              <li><Icon name="check" /> <span>Ao lado do metrô <strong>Pedro de Valdivia</strong> (Linha 1)</span></li>
              <li><Icon name="clock" /> <span>Seg a Sex <strong>9h–17h</strong> · Sáb <strong>9h–13h</strong> · Dom fechado</span></li>
            </ul>
            <div className="px-loc-ctas">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="px-btn-gold" onClick={() => track.whatsappClick("pix-loc")}>Falar no WhatsApp</a>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="px-btn-outline" onClick={() => track.mapsClick()}>Ver no mapa</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-section px-section-light">
        <div className="px-section-head">
          <span className="px-label">Perguntas frequentes</span>
          <h2>Tudo sobre o <em>câmbio com Pix</em></h2>
        </div>
        <div className="px-faq">
          {[
            { q: "A Gamaex aceita Pix?", a: "Sim. Na Gamaex você paga em reais pelo Pix e recebe na hora, em dinheiro, a moeda que quiser — pesos chilenos, dólares ou outra. É feito presencialmente na nossa loja em Av. Pedro de Valdivia 020, Providencia, Santiago." },
            { q: "Como funciona o câmbio com Pix?", a: "Você vem até a loja, escaneia o QR code e paga em reais pelo Pix, direto do seu banco no Brasil. Na mesma hora recebe em dinheiro a moeda que escolher. Simples e rápido." },
            { q: "Posso receber dólares em vez de pesos chilenos?", a: "Sim. Você escolhe a moeda que quer receber: pesos chilenos, dólares e mais de 40 moedas. Basta avisar no balcão." },
            { q: "O câmbio com Pix é só presencial?", a: "Sim. O pagamento com Pix é feito presencialmente na nossa loja em Providencia, escaneando o QR code. Assim você retira o dinheiro em espécie na hora." },
            { q: "Onde fica a Gamaex em Santiago?", a: "Av. Pedro de Valdivia 020, Providencia, Santiago do Chile — ao lado da saída do metrô Pedro de Valdivia (Linha 1). Atendemos de segunda a sexta das 9h às 17h e sábado das 9h às 13h." },
            { q: "Vale a pena trocar reais no Chile com Pix?", a: "Sim. Trocando com Pix na Gamaex você não precisa trazer dinheiro em espécie do Brasil, recebe na hora e evita as tarifas do cartão internacional. Somos uma casa de câmbio com 38 anos de trajetória e loja física em Providencia." },
          ].map((item, i) => (
            <details key={i} className="px-faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-cta">
        <h2>Chegou em Santiago? <em>Troque com Pix.</em></h2>
        <p>Av. Pedro de Valdivia 020 · Providencia · a poucos passos do metrô Pedro de Valdivia</p>
        <div className="px-cta-row">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="px-btn-gold" onClick={() => track.whatsappClick("pix-cta")}>Falar no WhatsApp</a>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="px-btn-outline" onClick={() => track.mapsClick()}>Como chegar</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-footer">
        <p>© {new Date().getFullYear()} Inversiones y Turismo Gamaex Chile S.A. — Casa de câmbio em Providencia, Santiago.</p>
        <div className="px-footer-links">
          <a href="/">Início · Inicio</a>
          <a href="/servicios">Serviços</a>
          <a href="/nosotros">Sobre nós</a>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">Mapa</a>
        </div>
      </footer>

      <style>{`
        .px-root {
          --gold-light: #E8C76E; --gold: #C9A84C; --gold-deep: #9C7E2E;
          --dark: #0F1419; --dark-2: #1A1F26;
          --light: #FAF8F2; --light-2: #F3F0E6;
          --white: #FFFFFF; --border: #E8E4D6; --gray: #6B7280;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--dark); background: var(--white);
          line-height: 1.55; -webkit-font-smoothing: antialiased;
        }
        .px-root * { box-sizing: border-box; }
        .px-root a { text-decoration: none; color: inherit; }
        .px-root h1, .px-root h2 { margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; letter-spacing: -0.5px; line-height: 1.1; }
        .px-root h3 { margin: 0; font-family: 'Inter', sans-serif; font-weight: 700; letter-spacing: -0.3px; line-height: 1.25; }
        .px-root p { margin: 0; }
        .px-root em { font-style: normal; color: var(--gold-deep); }

        /* HERO */
        .px-hero { background: linear-gradient(180deg, var(--dark) 0%, var(--dark-2) 100%); color: var(--white); padding: 5.5rem 6% 5rem; text-align: center; position: relative; overflow: hidden; }
        .px-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 25%, rgba(201,168,76,0.16), transparent 52%), radial-gradient(ellipse at 82% 72%, rgba(201,168,76,0.09), transparent 52%); pointer-events: none; }
        .px-hero-inner { position: relative; max-width: 820px; margin: 0 auto; }
        .px-hero h1 { font-size: clamp(2.3rem, 5vw, 3.7rem); color: var(--white); margin: 1.1rem 0 1.4rem; }
        .px-hero h1 em { color: var(--gold-light); }
        .px-hero-desc { color: rgba(255,255,255,0.78); font-size: 1.15rem; max-width: 640px; margin: 0 auto 2.3rem; }
        .px-hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        /* LABELS */
        .px-label { display: inline-block; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.8rem; }
        .px-section-dark .px-label { color: var(--gold-light); }

        /* BUTTONS */
        .px-btn-gold { background: var(--gold); color: var(--dark) !important; padding: 1rem 1.8rem; border-radius: 12px; font-weight: 700; font-size: 1rem; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
        .px-btn-gold:hover { background: var(--gold-deep); color: var(--white) !important; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(201,168,76,0.35); }
        .px-btn-outline { padding: 1rem 1.8rem; border-radius: 12px; font-weight: 600; font-size: 1rem; display: inline-flex; align-items: center; gap: 0.5rem; border: 1.5px solid rgba(255,255,255,0.4); color: var(--white) !important; transition: all 0.2s; background: transparent; }
        .px-btn-outline:hover { background: rgba(255,255,255,0.08); border-color: var(--white); }
        .px-section-light .px-btn-outline, .px-cta .px-btn-outline { border-color: var(--dark); color: var(--dark) !important; }
        .px-cta .px-btn-outline:hover { background: var(--dark); color: var(--white) !important; }

        /* ANSWER-FIRST */
        .px-answer { padding: 2.5rem 6% 0; margin-top: -2.5rem; position: relative; z-index: 2; }
        .px-answer-card { max-width: 820px; margin: 0 auto; background: var(--white); border: 1px solid var(--border); border-left: 4px solid var(--gold); border-radius: 14px; padding: 1.6rem 1.8rem; box-shadow: 0 12px 32px rgba(15,20,25,0.08); }
        .px-answer-card p { font-size: 1.1rem; line-height: 1.6; color: var(--dark); }

        /* SECTIONS */
        .px-section { padding: 5rem 6%; }
        .px-section-light { background: var(--light); }
        .px-section-dark { background: var(--dark); color: var(--white); }
        .px-section-dark h2 { color: var(--white); }
        .px-section-dark h2 em { color: var(--gold-light); }
        .px-section-head { max-width: 720px; margin: 0 auto 3rem; text-align: center; }
        .px-section-head h2 { font-size: clamp(1.8rem, 3.4vw, 2.7rem); margin-bottom: 1rem; }
        .px-section-sub { font-size: 1.08rem; color: var(--gray); line-height: 1.6; }

        /* STEPS */
        .px-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1050px; margin: 0 auto; }
        .px-step { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 2.2rem 1.8rem; position: relative; }
        .px-step-num { position: absolute; top: -14px; left: 1.8rem; width: 34px; height: 34px; border-radius: 50%; background: var(--gold); color: var(--dark); font-weight: 800; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(201,168,76,0.4); }
        .px-step-icon { width: 52px; height: 52px; border-radius: 13px; background: rgba(201,168,76,0.16); color: var(--gold-deep); display: flex; align-items: center; justify-content: center; margin: 0.6rem 0 1.1rem; }
        .px-step h3 { font-size: 1.2rem; margin-bottom: 0.7rem; }
        .px-step p { font-size: 0.98rem; line-height: 1.6; color: var(--gray); }

        /* CARDS */
        .px-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.4rem; max-width: 1000px; margin: 0 auto; }
        .px-card { background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 2rem; transition: all 0.3s; }
        .px-card:hover { border-color: var(--gold); box-shadow: 0 12px 30px rgba(15,20,25,0.08); transform: translateY(-3px); }
        .px-card-icon { width: 52px; height: 52px; border-radius: 13px; background: rgba(201,168,76,0.16); color: var(--gold-deep); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
        .px-card h3 { font-size: 1.18rem; margin-bottom: 0.7rem; }
        .px-card p { font-size: 0.98rem; line-height: 1.6; color: var(--gray); }

        /* LOCALIZAÇÃO */
        .px-loc { max-width: 780px; margin: 0 auto; text-align: center; }
        .px-loc-list { list-style: none; padding: 0; margin: 2rem auto; display: flex; flex-direction: column; gap: 1rem; max-width: 520px; text-align: left; }
        .px-loc-list li { display: flex; align-items: center; gap: 0.9rem; font-size: 1.05rem; color: rgba(255,255,255,0.85); }
        .px-loc-list li svg { color: var(--gold-light); flex-shrink: 0; }
        .px-loc-list strong { color: var(--white); }
        .px-loc-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem; }

        /* FAQ */
        .px-faq { max-width: 760px; margin: 0 auto; }
        .px-faq-item { border-bottom: 1px solid var(--border); }
        .px-faq-item summary { cursor: pointer; padding: 1.3rem 0.2rem; font-size: 1.05rem; font-weight: 600; color: var(--dark); list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: color 0.2s; }
        .px-faq-item summary::-webkit-details-marker { display: none; }
        .px-faq-item summary::after { content: '+'; font-size: 1.5rem; font-weight: 400; color: var(--gold-deep); flex-shrink: 0; transition: transform 0.2s; }
        .px-faq-item[open] summary::after { transform: rotate(45deg); }
        .px-faq-item summary:hover { color: var(--gold-deep); }
        .px-faq-item p { padding: 0 0.2rem 1.3rem; font-size: 0.98rem; line-height: 1.7; color: var(--gray); }

        /* CTA */
        .px-cta { padding: 5rem 6%; text-align: center; background: var(--light-2); border-top: 1px solid var(--border); }
        .px-cta h2 { font-size: clamp(1.9rem, 3.6vw, 2.9rem); margin-bottom: 0.8rem; }
        .px-cta > p { font-size: 1.05rem; color: var(--gray); margin-bottom: 2rem; }
        .px-cta-row { display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; }

        /* FOOTER */
        .px-footer { padding: 2.5rem 6%; background: var(--dark); color: rgba(255,255,255,0.6); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; font-size: 0.88rem; }
        .px-footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .px-footer-links a { color: rgba(255,255,255,0.6); transition: color 0.2s; }
        .px-footer-links a:hover { color: var(--gold-light); }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .px-steps { grid-template-columns: 1fr; }
          .px-cards { grid-template-columns: 1fr; }
          .px-section { padding: 3.5rem 5%; }
          .px-hero { padding: 4rem 5% 3.5rem; }
          .px-cta { padding: 3.5rem 5%; }
          .px-footer { flex-direction: column; text-align: center; }
        }
        @media (max-width: 500px) {
          .px-hero-ctas, .px-cta-row, .px-loc-ctas { flex-direction: column; }
          .px-hero-ctas a, .px-cta-row a, .px-loc-ctas a { width: 100%; justify-content: center; }
        }
      `}</style>
    </main>
  );
}
