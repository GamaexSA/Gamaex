"use client";

import { track, trackEvent } from "./analytics";

const REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJWTo0fmbPYpYR4XOn4uAxnIU";

export default function DejarResenaPage() {
  const onReviewClick = () => trackEvent("review_intent", "engagement", "dejar_resena_page");

  return (
    <div className="rs-root">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --gold-light: #E8C76E; --gold: #C9A84C; --gold-deep: #9C7E2E;
          --dark: #0F1419; --light: #FAF8F2;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        .rs-root {
          min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 2rem 1.25rem; background: linear-gradient(180deg, var(--light) 0%, #fff 60%);
          font-family: 'Inter', -apple-system, system-ui, sans-serif; color: var(--dark);
          text-align: center;
        }
        .rs-card {
          max-width: 460px; width: 100%; background: white; border-radius: 24px;
          padding: 2.75rem 1.75rem; box-shadow: 0 8px 40px rgba(15,20,25,0.08);
          border: 1px solid rgba(201,168,76,0.18);
        }
        .rs-logo {
          width: 80px; height: 80px; border-radius: 22px; margin: 0 auto 1.5rem;
          background: var(--dark); display: flex; align-items: center; justify-content: center;
        }
        .rs-stars { font-size: 2rem; letter-spacing: 0.2rem; color: var(--gold); margin-bottom: 1rem; }
        h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.85rem; line-height: 1.15; font-weight: 600; margin-bottom: 0.85rem;
          color: var(--dark);
        }
        h1 .accent { color: var(--gold-deep); }
        p { font-size: 1rem; line-height: 1.55; color: #4B5563; margin-bottom: 1.75rem; }
        .rs-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%; padding: 1.1rem 1.5rem; border-radius: 14px; font-size: 1.05rem; font-weight: 700;
          background: var(--gold); color: var(--dark); text-decoration: none; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(201,168,76,0.3);
        }
        .rs-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.4); background: var(--gold-light); }
        .rs-foot {
          margin-top: 2rem; font-size: 0.82rem; color: #6B7280;
        }
        .rs-foot a { color: var(--gold-deep); text-decoration: none; font-weight: 600; }
        @media (max-width: 480px) {
          h1 { font-size: 1.55rem; }
          .rs-card { padding: 2rem 1.25rem; }
        }
      `}} />
      <div className="rs-card">
        <div className="rs-logo">
          <svg viewBox="0 0 100 100" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rsGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8C76E"/>
                <stop offset="50%" stopColor="#C9A84C"/>
                <stop offset="100%" stopColor="#9C7E2E"/>
              </linearGradient>
            </defs>
            <g transform="translate(50,50)">
              <circle cx="0" cy="0" r="34" fill="none" stroke="url(#rsGold)" strokeWidth="2"/>
              <path d="M -16 -18 A 22 22 0 1 0 16 18 L 16 0 L 0 0" fill="none" stroke="url(#rsGold)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          </svg>
        </div>
        <div className="rs-stars">★★★★★</div>
        <h1>Tu opinión <span className="accent">nos ayuda a mejorar</span></h1>
        <p>
          Gracias por elegir Gamaex. Si tu experiencia fue buena,
          contárselo a Google nos ayuda muchísimo a seguir creciendo
          como casa de cambio familiar.
        </p>
        <a
          href={REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rs-btn"
          onClick={onReviewClick}
        >
          ★ Dejar reseña en Google
        </a>
        <div className="rs-foot">
          ¿Algo no salió bien? Escribinos a{" "}
          <a href="https://wa.me/56938782514?text=Hola%2C%20quiero%20dejar%20feedback%20sobre%20mi%20experiencia%20en%20Gamaex." onClick={() => track.whatsappClick("review-feedback")}>
            WhatsApp
          </a>{" "}
          y lo solucionamos.
        </div>
      </div>
    </div>
  );
}
