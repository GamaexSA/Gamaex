"use client";

// Página de Servicios standalone (no usa landing-page.tsx). Estilo grid tipo More
// Exchange, marca Gamaex (crema/dorado). Servicios reales de Gamaex + el nuevo
// "Pago de tarjetas de crédito" que pidió el dueño.

const WA = "https://wa.me/56938782514?text=" + encodeURIComponent("Hola, quiero consultar por sus servicios en Gamaex.");

const SERVICIOS = [
  {
    icon: "💱",
    title: "Cambio de divisas",
    desc: "Compra y venta de dólares, euros y más de 40 monedas al tipo de cambio del día. Precios publicados, sin comisiones ocultas.",
  },
  {
    icon: "🌍",
    title: "Transferencias internacionales",
    desc: "Envío y recepción de fondos al exterior: pago a proveedores, operaciones en el extranjero y remesas familiares. Asesoría en cada operación.",
  },
  {
    icon: "💳",
    title: "Pago de tarjetas de crédito",
    desc: "Paga tu tarjeta de crédito internacional al tipo de cambio del día. Consulta el valor con nosotros antes de pagarla con el banco.",
  },
  {
    icon: "🏢",
    title: "Empresas y pago a proveedores",
    desc: "Para empresas que operan o pagan en moneda extranjera. Condiciones especiales por volumen y atención corporativa dedicada.",
  },
  {
    icon: "🤝",
    title: "Asesoría personalizada",
    desc: "Te acompañamos en cada operación con atención directa. 38 años de experiencia en el mercado cambiario chileno.",
  },
  {
    icon: "⭐",
    title: "Atención preferencial",
    desc: "Módulos privados para operaciones de mayor monto. Discreción total, trato personalizado y seguridad en local físico.",
  },
];

const PASOS = [
  { n: "1", t: "Déjanos tus datos", d: "Completa el formulario de «Hazte cliente» con tu información." },
  { n: "2", t: "Te validamos", d: "Te contactamos para verificar el registro y completar los requisitos." },
  { n: "3", t: "Empieza a operar", d: "Como cliente registrado operas más rápido, presencial o coordinado." },
];

export default function ServiciosPage() {
  return (
    <main className="sv-wrap">
      <header className="sv-top">
        <a href="/" className="sv-brand" aria-label="Gamaex — inicio">
          <span className="sv-logo">GAMAEX</span>
          <span className="sv-sub">Casa de cambio · Providencia</span>
        </a>
        <nav className="sv-nav">
          <a href="/">Inicio</a>
          <a href="/#contacto">Contacto</a>
          <a href="/hazte-cliente" className="sv-cta-mini">Hazte cliente</a>
        </nav>
      </header>

      <section className="sv-hero">
        <p className="sv-eyebrow">Nuestros servicios</p>
        <h1>Más que una casa de cambio</h1>
        <p className="sv-lede">
          38 años en Providencia operando divisas, transferencias internacionales y pagos en moneda
          extranjera. Precios publicados, sin comisiones ocultas, atención presencial.
        </p>
        <div className="sv-hero-cta">
          <a href="/hazte-cliente" className="sv-btn">Hazte cliente</a>
          <a href={WA} target="_blank" rel="noopener noreferrer" className="sv-btn-wa">Consultar por WhatsApp</a>
        </div>
      </section>

      <section className="sv-grid" aria-label="Servicios">
        {SERVICIOS.map((s) => (
          <article className="sv-card" key={s.title}>
            <div className="sv-icon" aria-hidden="true">{s.icon}</div>
            <h2>{s.title}</h2>
            <p>{s.desc}</p>
          </article>
        ))}
      </section>

      <section className="sv-pasos">
        <p className="sv-eyebrow center">Hazte cliente en 3 pasos</p>
        <div className="sv-pasos-grid">
          {PASOS.map((p) => (
            <div className="sv-paso" key={p.n}>
              <div className="sv-paso-n">{p.n}</div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
        <a href="/hazte-cliente" className="sv-btn sv-btn-lg">Empezar registro</a>
      </section>

      <footer className="sv-foot">
        Av. Pedro de Valdivia 020, Providencia · Lun–Vie 9:00–17:00 · Sáb 9:00–13:00
      </footer>

      <style jsx>{`
        .sv-wrap {
          min-height: 100vh; background: #faf8f2; color: #16181c;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .sv-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 6%; border-bottom: 1px solid #e8e4d6; background: rgba(255,255,255,0.9);
          position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px);
        }
        .sv-brand { text-decoration: none; display: flex; flex-direction: column; }
        .sv-logo { font-weight: 800; letter-spacing: 0.2em; font-size: 18px; color: #0f1419; }
        .sv-sub { font-size: 11px; color: #8a8f97; margin-top: 2px; }
        .sv-nav { display: flex; align-items: center; gap: 1.5rem; }
        .sv-nav a { text-decoration: none; color: #4b5058; font-size: 15px; font-weight: 500; }
        .sv-nav a:hover { color: #0f1419; }
        .sv-cta-mini { background: #0f1419; color: #fff !important; padding: 8px 16px; border-radius: 10px; }

        .sv-hero { max-width: 780px; margin: 0 auto; padding: 64px 6% 40px; text-align: center; }
        .sv-eyebrow { text-transform: uppercase; letter-spacing: 0.16em; font-size: 12px; font-weight: 700; color: #c9781a; margin: 0 0 14px; }
        .sv-eyebrow.center { text-align: center; }
        .sv-hero h1 { font-size: clamp(30px, 5vw, 46px); line-height: 1.08; margin: 0 0 16px; font-weight: 800; letter-spacing: -0.02em; }
        .sv-lede { font-size: 17px; color: #5b6069; max-width: 60ch; margin: 0 auto; }
        .sv-hero-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 26px; }
        .sv-btn { background: #c9a84c; color: #0f1419; text-decoration: none; font-weight: 700; padding: 13px 24px; border-radius: 12px; font-size: 15px; }
        .sv-btn:hover { background: #b8952f; }
        .sv-btn-lg { display: inline-block; margin-top: 26px; }
        .sv-btn-wa { background: #25d366; color: #fff; text-decoration: none; font-weight: 700; padding: 13px 24px; border-radius: 12px; font-size: 15px; }

        .sv-grid { max-width: 1080px; margin: 0 auto; padding: 20px 6% 40px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .sv-card { background: #fff; border: 1px solid #e8e4d6; border-radius: 16px; padding: 26px 24px; box-shadow: 0 8px 30px rgba(15,20,25,0.05); }
        .sv-icon { font-size: 30px; margin-bottom: 12px; }
        .sv-card h2 { font-size: 19px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.01em; }
        .sv-card p { font-size: 14.5px; color: #5b6069; margin: 0; line-height: 1.6; }

        .sv-pasos { background: #0f1419; color: #f4f1ea; padding: 56px 6%; margin-top: 20px; text-align: center; }
        .sv-pasos .sv-eyebrow { color: #e8c76e; }
        .sv-pasos-grid { max-width: 900px; margin: 8px auto 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .sv-paso-n { width: 44px; height: 44px; border-radius: 50%; background: #c9a84c; color: #0f1419; font-weight: 800; font-size: 20px; line-height: 44px; margin: 0 auto 14px; }
        .sv-paso h3 { font-size: 18px; margin: 0 0 6px; font-weight: 700; }
        .sv-paso p { font-size: 14.5px; color: #cbbf9f; margin: 0; }

        .sv-foot { text-align: center; color: #9aa0a6; font-size: 13px; padding: 28px 6%; }

        @media (max-width: 860px) {
          .sv-grid, .sv-pasos-grid { grid-template-columns: 1fr; }
          .sv-nav { gap: 1rem; }
          .sv-nav a:not(.sv-cta-mini) { display: none; }
        }
      `}</style>
    </main>
  );
}
