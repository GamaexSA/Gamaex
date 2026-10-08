import type { Locale } from "./messages";

// Copias de la página de inicio (home) en los 3 idiomas del sitio.
// Los strings pueden llevar marcado ligero (**negrita**, [texto](url)) que
// se renderiza con renderRich(). Las reseñas reales de clientes NO se traducen.

export interface HomeFaqItem {
  q: string;
  a: string; // texto enriquecido
}

export interface HomeCopy {
  nav: {
    tasas: string; servicios: string; nosotros: string; contacto: string;
    alerta: string; faq: string; ubicacion: string;
    openNow: string; closed: string;
    cotizar: string; cotizarWa: string; llamarLocal: string;
    openMenu: string; closeMenu: string; cliente: string;
  };
  hero: {
    tag: string; h1Before: string; h1Accent: string; heroDesc: string;
    badges: string[];
  };
  calc: {
    title: string; youGive: string; youGet: string; rateToday: string;
    swap: string; ctaWa: string; ctaForm: string; share: string;
    shareCopied: string; secureNote: string; updated: string;
  };
  stats: { years: string; currencies: string; hiddenFees: string; avgOp: string };
  tasas: {
    label: string; title: string; subtitle: string; lastUpdate: string;
    stale: string; empty: string; emptyCta: string;
    bigTitle: string; bigSub: string; bigCta: string; foot: string;
  };
  opiniones: { label: string; title: string; subtitle: string; emptyReview: string };
  faq: { label: string; title: string; items: HomeFaqItem[]; ctaText: string; ctaBtn: string };
  ubicacion: {
    label: string; title: string; subtitle: string;
    rowAddress: string; rowMetro: string; rowPhone: string;
    addressValue: string; metroValue: string;
    hoursWeek: string; hoursSat: string; hoursSun: string;
    weekTime: string; satTime: string; closed: string;
    seeMaps: string; cotizarNow: string; call: string;
  };
  contacto: { label: string; title: string; subtitle: string };
  form: {
    question: string; wantBuy: string; wantSell: string;
    currency: string; amountPre: string; amountPost: string; amountPlaceholder: string;
    name: string; lastName: string; email: string; phone: string;
    message: string; optional: string; messagePlaceholder: string;
    emailPlaceholder: string; phonePlaceholder: string;
    send: string; sending: string; legal: string;
    successTitle: string; successBody: string; sendAnother: string; goHome: string;
    errGeneric: string; errConn: string;
  };
  quicklinks: { title: string; links: { href: string; label: string }[] };
  footer: {
    tagline: string; colServicios: string; colInfo: string; colContacto: string;
    sCambio: string; sTransfer: string; sPago: string; sCorp: string;
    iTasas: string; iNosotros: string; iAlerta: string; iOpiniones: string;
    iFaq: string; iComoLlegar: string; hoursLine: string; rights: string;
    noSpam: string;
  };
  wa: { generic: string; bigAmount: string; faqMsg: string; calc: string };
}

const MAPS = "https://www.google.com/maps/place/?q=place_id:ChIJWTo0fmbPYpYR4XOn4uAxnIU";

const QUICKLINKS_HREFS = [
  "/comprar-dolares-santiago", "/vender-dolares-santiago",
  "/comprar-dolares-providencia", "/vender-dolares-providencia",
  "/precio-dolar-hoy-chile", "/cambio-dolar-hoy-chile",
  "/cambiar-dolares-a-pesos-chilenos", "/comprar-dolares-sin-comision",
  "/mejor-tipo-de-cambio-santiago", "/comprar-euros-santiago",
  "/vender-euros-santiago", "/tipo-de-cambio-euro-chile",
];

const es: HomeCopy = {
  nav: {
    tasas: "Precios", servicios: "Servicios", nosotros: "Nosotros", contacto: "Contacto",
    alerta: "Alerta de precio", faq: "FAQ", ubicacion: "Ubicación",
    openNow: "Abierto ahora", closed: "Cerrado",
    cotizar: "💬 Cotizar", cotizarWa: "💬 Cotizar por WhatsApp", llamarLocal: "📞 Llamar al local",
    openMenu: "Abrir menú", closeMenu: "Cerrar menú", cliente: "Hazte cliente",
  },
  hero: {
    tag: "⚡ Casa de cambio · Providencia",
    h1Before: "Casa de cambio en ", h1Accent: "Providencia",
    heroDesc: "38 años de trayectoria a pasos del Metro Pedro de Valdivia. Compra y venta de dólares, euros, reales y más de 40 divisas.",
    badges: ["0% comisiones", "+40 divisas", "Atención presencial", "Desde 1988"],
  },
  calc: {
    title: "¿Cuánto quieres cambiar hoy?",
    youGive: "Tú entregas", youGet: "Tú recibes", rateToday: "Tasa referencial",
    swap: "Invertir monedas",
    ctaWa: "💬 Cotizar por WhatsApp →", ctaForm: "📝 Déjanos tus datos y te contactamos →",
    share: "🔗 Compartir cotización", shareCopied: "✓ Enlace copiado",
    secureNote: "🔒 Precio referencial · El valor final se confirma por WhatsApp · Sin comisiones",
    updated: "Referencia",
  },
  stats: { years: "Años de trayectoria", currencies: "Divisas disponibles", hiddenFees: "Comisiones ocultas", avgOp: "Operación promedio" },
  tasas: {
    label: "Precios referenciales", title: "Precios referenciales de hoy",
    subtitle: "Los precios cambian durante el día y son solo referenciales. **El precio final de tu operación se confirma por WhatsApp.**",
    lastUpdate: "Referencia actualizada:",
    stale: "⚠ Precios temporalmente no disponibles — consultar por WhatsApp",
    empty: "Cotizaciones no disponibles en este momento.", emptyCta: "Consultar por WhatsApp →",
    bigTitle: "Consulte precio por montos mayores",
    bigSub: "Para operaciones de mayor volumen aplicamos tasa preferencial.",
    bigCta: "💬 Consultar",
    foot: "Cotización orientativa. El tipo de cambio se determina por la oferta y demanda del mercado; según el [Banco Central de Chile](https://www.bcentral.cl), el «dólar observado» que publica cada día hábil es la referencia oficial. Para confirmar precio y operar, consúltenos directamente.",
  },
  opiniones: {
    label: "Opiniones reales", title: "Lo que dicen nuestros clientes",
    subtitle: `Reseñas verificadas en [Google Maps](${MAPS}) · 4,5 ★ con más de 35 opiniones`,
    emptyReview: "Calificación de 5 estrellas en Google.",
  },
  faq: {
    label: "Preguntas frecuentes", title: "Lo que más nos preguntan",
    ctaText: "¿Tienes otra pregunta? Escríbenos directamente.", ctaBtn: "💬 Consultar por WhatsApp",
    items: [
      { q: "¿Cuál es la casa de cambio más segura para comprar dólares en Santiago?", a: "Gamaex tiene 38 años de trayectoria en Providencia (fundada en 1987). Operamos en local físico verificable en Av. Pedro de Valdivia 020, sin entregas en la calle ni intermediarios. Somos sociedad anónima registrada (Inversiones y Turismo Gamaex Chile S.A.) con reseñas verificables en Google. Tasas publicadas y atención personalizada." },
      { q: "¿Gamaex es una casa de cambio confiable y regulada?", a: "Sí. Gamaex es **Inversiones y Turismo Gamaex Chile S.A.**, una casa de cambio establecida en Av. Pedro de Valdivia 020, Providencia, con local físico y operación continua desde 1987. Figura en el registro público de entidades reportantes de la [Unidad de Análisis Financiero (UAF)](https://www.uaf.cl) en el rubro casas de cambio — el organismo que en Chile fiscaliza al sector en prevención de lavado de activos. A eso se suman más de tres décadas de trayectoria y reseñas verificables en Google." },
      { q: "¿Por qué Gamaex no aparece en la CMF? ¿Es confiable igual?", a: "Que una casa de cambio no aparezca en la Comisión para el Mercado Financiero (CMF) es normal y esperable: la **CMF supervisa a los bancos y al mercado cambiario formal, no a las casas de cambio**. En Chile las casas de cambio operan legalmente y su fiscalización en prevención de lavado de activos corresponde a la [Unidad de Análisis Financiero (UAF)](https://www.uaf.cl), donde Gamaex sí está registrada como Inversiones y Turismo Gamaex Chile S.A., en el rubro casas de cambio. Por eso no figurar en la CMF no es una señal de alerta: lo relevante es tener local físico, trayectoria y registro en la UAF, como Gamaex desde 1987." },
      { q: "¿Qué casa de cambio está abierta hoy sábado en la mañana?", a: "Gamaex atiende los sábados de 9:00 a 13:00 en Av. Pedro de Valdivia 020, Providencia, a pasos del Metro Pedro de Valdivia. Una opción cercana en barrio alto para cambiar divisas un sábado sin ir al centro." },
      { q: "Necesito cambiar euros a pesos chilenos con buena tasa, ¿dónde voy?", a: "Compramos y vendemos euros (EUR) a pesos chilenos (CLP) con tasas competitivas. Los precios en gamaex.cl son referenciales y el precio final se confirma por WhatsApp antes de venir. Sin comisiones ocultas." },
      { q: "¿Compran y venden dólares?", a: "Sí. Compramos y vendemos dólares americanos (USD) y más de 40 monedas. Los precios publicados son referenciales y el precio final se confirma por WhatsApp antes de la operación." },
      { q: "¿Tienen comisiones adicionales?", a: "No. Operamos con precios finales. Sin comisiones ocultas, sin cargos extra. El precio que ves es el precio de la operación." },
      { q: "¿Puedo cotizar por WhatsApp antes de ir?", a: "Sí. Escríbenos con el monto y las monedas que quieres operar. Te confirmamos precio y disponibilidad al instante." },
      { q: "¿Qué monedas trabajan?", a: "Más de 40 monedas: dólar (USD), euro (EUR), real brasileño (BRL), libra esterlina (GBP), yen japonés (JPY), peso argentino (ARS), franco suizo (CHF) y muchas más." },
      { q: "¿Cuáles son los horarios de atención?", a: "Lunes a viernes de 9:00 a 17:00 y sábados de 9:00 a 13:00. Domingos y festivos cerrado." },
      { q: "¿Aceptan billetes en mal estado o fuera de circulación?", a: "Aceptamos dólares corrientes que no estén en circulación, sujeto a evaluación en el momento. Consúltanos por WhatsApp si tienes dudas sobre un billete específico." },
      { q: "¿Hacen transferencias internacionales?", a: "Sí. Ofrecemos transferencias internacionales y pago a proveedores en moneda extranjera. Tenemos condiciones especiales para empresas." },
      { q: "¿Aceptan Pix? (turistas brasileños)", a: "Sí. Los turistas brasileños pueden pagar con **Pix** en reales y recibir pesos chilenos o dólares en efectivo, al instante y de forma presencial en el local (escaneando un QR). Más información en [nuestra página de Pix](/pix)." },
      { q: "¿Qué documentos necesito para cambiar dólares u otras divisas en Chile?", a: "Para operaciones de montos menores el cambio suele ser directo: llegas con tu efectivo, aceptas el precio y recibes tu dinero en minutos. Para montos más altos, la normativa chilena de prevención de lavado de activos — fiscalizada por la [Unidad de Análisis Financiero (UAF)](https://www.uaf.cl) — exige identificar al cliente, por lo que te pueden pedir la cédula de identidad o el pasaporte. Es un requisito legal que aplica a todas las casas de cambio registradas en Chile." },
      { q: "¿Cuál es la diferencia entre el precio de compra y el de venta?", a: "El precio de compra es el valor al que la casa de cambio te compra la divisa: por ejemplo, cuando entregas dólares y recibes pesos chilenos. El precio de venta es el valor al que te la vende: cuando entregas pesos y te llevas dólares. La diferencia entre ambos precios se llama spread y es el margen con el que opera toda casa de cambio; por eso el precio de venta siempre es más alto que el de compra." },
      { q: "¿Cómo se determina el tipo de cambio en Chile?", a: "En Chile el tipo de cambio es flexible: el precio del dólar y de las demás divisas se determina por la oferta y la demanda del mercado, y por eso varía constantemente durante el día. Como referencia oficial, el [Banco Central de Chile](https://www.bcentral.cl) publica cada día hábil el «dólar observado», un promedio de las operaciones del mercado formal. Las casas de cambio fijan sus precios de compra y venta a partir de ese mercado." },
      { q: "¿Hay límites para cambiar efectivo en Chile?", a: "Cambiar efectivo es legal y no existe una prohibición general por monto. Sin embargo, las operaciones que superan ciertos umbrales están sujetas a la normativa de prevención de lavado de activos que fiscaliza la Unidad de Análisis Financiero (UAF): la casa de cambio debe identificar al cliente y registrar la operación. Si planeas cambiar una suma importante, te recomendamos escribirnos antes por WhatsApp para confirmar disponibilidad de billetes y agilizar la atención en el local." },
      { q: "¿Cómo funciona una casa de cambio?", a: "Una casa de cambio compra y vende monedas extranjeras al público. Publica un precio de compra y un precio de venta para cada divisa y obtiene su margen de la diferencia entre ambos (el spread), no de comisiones adicionales. La operación es inmediata: entregas una moneda y recibes la otra en el momento. En Chile las casas de cambio operan registradas ante la Unidad de Análisis Financiero y aplican verificación de identidad en operaciones de mayor monto." },
      { q: "¿Cómo llego al local?", a: "Estamos en Av. Pedro de Valdivia 020, Providencia. A pasos de la salida del Metro Pedro de Valdivia (Línea 1). También cerca de Costanera Center." },
      { q: "¿Gamaex envía correos masivos o hace llamados de publicidad?", a: "No. Gamaex **no realiza envío de correos masivos, mensajes ni llamados telefónicos con fines publicitarios o promocionales**. No compramos bases de datos ni contactamos a personas que no se hayan comunicado con nosotros primero. Solo respondemos a quienes nos escriben por sus propios medios (WhatsApp, teléfono, correo o el formulario del sitio). Si recibiste un mensaje que dice ser de Gamaex y tú no iniciaste el contacto, lo más probable es que no provenga de nosotros." },
    ],
  },
  ubicacion: {
    label: "Ven a vernos", title: "Av. Pedro de Valdivia 020, Providencia",
    subtitle: "A pasos del Metro Pedro de Valdivia (Línea 1). Atención presencial sin reserva.",
    rowAddress: "Dirección", rowMetro: "Metro", rowPhone: "Teléfono",
    addressValue: "Av. Pedro de Valdivia 020, Providencia, Santiago",
    metroValue: "Pedro de Valdivia · Línea 1 (a 50 metros)",
    hoursWeek: "Lun – Vie", hoursSat: "Sábado", hoursSun: "Domingo",
    weekTime: "9:00 — 17:00", satTime: "9:00 — 13:00", closed: "Cerrado",
    seeMaps: "📍 Ver en Maps", cotizarNow: "💬 Cotizar ahora", call: "📞 Llamar",
  },
  contacto: {
    label: "Contacto", title: "Déjanos tus datos",
    subtitle: "Completa el formulario y te contactamos con el precio final y la disponibilidad. Más simple y ordenado que escribir por WhatsApp.",
  },
  form: {
    question: "¿Qué necesitas?", wantBuy: "Quiero comprar", wantSell: "Quiero vender",
    currency: "Moneda", amountPre: "Monto (en ", amountPost: ")", amountPlaceholder: "Ej: 1.000",
    name: "Nombre", lastName: "Apellido", email: "Email", phone: "Teléfono / WhatsApp",
    message: "Mensaje", optional: "(opcional)", messagePlaceholder: "¿Algo que debamos saber? (opcional)",
    emailPlaceholder: "tu@correo.cl", phonePlaceholder: "+56 9 ...",
    send: "Enviar solicitud", sending: "Enviando…",
    legal: "Tus datos solo se usan para contactarte por esta cotización.",
    successTitle: "¡Solicitud enviada!",
    successBody: "Recibimos tus datos. Te contactamos a la brevedad con el precio final y la disponibilidad. Gracias por preferir Gamaex.",
    sendAnother: "Enviar otra solicitud", goHome: "Ir al inicio",
    errGeneric: "No pudimos enviar la solicitud. Intenta de nuevo.",
    errConn: "Problema de conexión. Revisa tu internet e intenta de nuevo.",
  },
  quicklinks: {
    title: "Búsquedas frecuentes",
    links: [
      "Comprar dólares en Santiago", "Vender dólares en Santiago",
      "Comprar dólares en Providencia", "Vender dólares en Providencia",
      "Precio del dólar hoy", "Cambio del dólar hoy en Chile",
      "Cambiar dólares a pesos", "Comprar dólares sin comisión",
      "Mejor tipo de cambio en Santiago", "Comprar euros en Santiago",
      "Vender euros en Santiago", "Tipo de cambio del euro",
    ].map((label, i) => ({ href: QUICKLINKS_HREFS[i]!, label })),
  },
  footer: {
    tagline: "38 años brindando el mejor tipo de cambio en Santiago. Casa de cambio en Providencia, a pasos del Metro Pedro de Valdivia.",
    colServicios: "Servicios", colInfo: "Información", colContacto: "Contacto",
    sCambio: "Cambio de divisas", sTransfer: "Transferencias", sPago: "Pago a proveedores", sCorp: "Atención corporativa",
    iTasas: "Tasas de hoy", iNosotros: "Quiénes somos", iAlerta: "Alerta de precio",
    iOpiniones: "Opiniones", iFaq: "FAQ", iComoLlegar: "Cómo llegar",
    hoursLine: "Lun–Vie 9:00–17:00 · Sáb 9:00–13:00",
    rights: "Gamaex Chile · Inversiones y Turismo Gamaex Chile S.A.",
    noSpam: "Gamaex no envía correos masivos ni realiza llamados telefónicos con fines publicitarios. Solo respondemos a quienes nos contactan directamente.",
  },
  wa: {
    generic: "Hola, quiero consultar una cotización en Gamaex.",
    bigAmount: "Hola, quiero consultar precio por un monto mayor.",
    faqMsg: "Hola, tengo una consulta sobre el servicio de Gamaex.",
    calc: "Hola, quiero cotizar {amount} {from} a {to} en Gamaex. ¿Pueden confirmarme precio y disponibilidad?",
  },
};

const en: HomeCopy = {
  nav: {
    tasas: "Prices", servicios: "Services", nosotros: "About", contacto: "Contact",
    alerta: "Price alert", faq: "FAQ", ubicacion: "Location",
    openNow: "Open now", closed: "Closed",
    cotizar: "💬 Get a quote", cotizarWa: "💬 Get a quote on WhatsApp", llamarLocal: "📞 Call the office",
    openMenu: "Open menu", closeMenu: "Close menu", cliente: "Become a client",
  },
  hero: {
    tag: "⚡ Currency exchange · Providencia",
    h1Before: "Currency exchange in ", h1Accent: "Providencia",
    heroDesc: "38 years of experience steps from Pedro de Valdivia metro station. We buy and sell US dollars, euros, Brazilian reais and 40+ currencies.",
    badges: ["0% commission", "40+ currencies", "In-person service", "No app, no sign-up", "Since 1988"],
  },
  calc: {
    title: "How much do you want to exchange today?",
    youGive: "You give", youGet: "You get", rateToday: "Reference rate",
    swap: "Swap currencies",
    ctaWa: "💬 Get a quote on WhatsApp →", ctaForm: "📝 Leave your details and we'll contact you →",
    share: "🔗 Share quote", shareCopied: "✓ Link copied",
    secureNote: "🔒 Reference price · Final price confirmed on WhatsApp · No commissions",
    updated: "Reference",
  },
  stats: { years: "Years in business", currencies: "Currencies available", hiddenFees: "Hidden fees", avgOp: "Average transaction" },
  tasas: {
    label: "Reference prices", title: "Today's reference prices",
    subtitle: "Prices change throughout the day and are for reference only. **The final price of your transaction is confirmed on WhatsApp.**",
    lastUpdate: "Reference updated:",
    stale: "⚠ Prices temporarily unavailable — ask on WhatsApp",
    empty: "Rates unavailable at the moment.", emptyCta: "Ask on WhatsApp →",
    bigTitle: "Ask about rates for larger amounts",
    bigSub: "We offer preferential rates for higher-volume transactions.",
    bigCta: "💬 Ask",
    foot: "Indicative quote. Exchange rates are set by market supply and demand; according to the [Central Bank of Chile](https://www.bcentral.cl), the “observed dollar” it publishes each business day is the official reference. To confirm a price and trade, contact us directly.",
  },
  opiniones: {
    label: "Real reviews", title: "What our customers say",
    subtitle: `Verified reviews on [Google Maps](${MAPS}) · 4.5 ★ with 35+ reviews`,
    emptyReview: "5-star rating on Google.",
  },
  faq: {
    label: "FAQ", title: "What people ask us most",
    ctaText: "Have another question? Message us directly.", ctaBtn: "💬 Ask on WhatsApp",
    items: [
      { q: "Which is the safest currency exchange to buy US dollars in Santiago?", a: "Gamaex has 38 years of experience in Providencia (founded in 1987). We operate from a verifiable physical office at Av. Pedro de Valdivia 020, with no street handovers or middlemen. We are a registered corporation (Inversiones y Turismo Gamaex Chile S.A.) with verifiable Google reviews. Published rates and personal service." },
      { q: "Is Gamaex a trustworthy, regulated currency exchange?", a: "Yes. Gamaex is **Inversiones y Turismo Gamaex Chile S.A.**, a currency exchange located at Av. Pedro de Valdivia 020, Providencia, with a physical office in continuous operation since 1987. It appears in the public register of reporting entities of the [Financial Analysis Unit (UAF)](https://www.uaf.cl) under the currency-exchange category — the body that oversees the sector in Chile for anti-money-laundering purposes. Add to that three-plus decades of experience and verifiable Google reviews." },
      { q: "Why doesn't Gamaex appear in the CMF? Is it still trustworthy?", a: "It's normal and expected that a currency exchange doesn't appear in the Financial Market Commission (CMF): the **CMF supervises banks and the formal foreign-exchange market, not currency-exchange houses**. In Chile, currency exchanges operate legally and their anti-money-laundering oversight falls to the [Financial Analysis Unit (UAF)](https://www.uaf.cl), where Gamaex is indeed registered as Inversiones y Turismo Gamaex Chile S.A. under the currency-exchange category. So not being listed in the CMF is not a red flag: what matters is a physical office, a track record and UAF registration — which Gamaex has had since 1987." },
      { q: "Which currency exchange is open on Saturday morning?", a: "Gamaex is open on Saturdays from 9:00 to 13:00 at Av. Pedro de Valdivia 020, Providencia, steps from the Pedro de Valdivia metro. A convenient uptown option to exchange currency on a Saturday without going downtown." },
      { q: "I need to exchange euros for Chilean pesos at a good rate — where do I go?", a: "We buy and sell euros (EUR) for Chilean pesos (CLP) at competitive rates. Prices on gamaex.cl are for reference and the final price is confirmed on WhatsApp before you come in. No hidden fees." },
      { q: "Do you buy and sell US dollars?", a: "Yes. We buy and sell US dollars (USD) and 40+ currencies. Published prices are for reference and the final price is confirmed on WhatsApp before the transaction." },
      { q: "Are there any additional fees?", a: "No. We work with final prices. No hidden fees, no extra charges. The price you see is the price of the transaction." },
      { q: "Can I get a quote on WhatsApp before coming in?", a: "Yes. Message us with the amount and currencies you want to exchange. We'll confirm price and availability right away." },
      { q: "Which currencies do you handle?", a: "Over 40 currencies: US dollar (USD), euro (EUR), Brazilian real (BRL), pound sterling (GBP), Japanese yen (JPY), Argentine peso (ARS), Swiss franc (CHF) and many more." },
      { q: "What are your opening hours?", a: "Monday to Friday from 9:00 to 17:00 and Saturdays from 9:00 to 13:00. Closed on Sundays and public holidays." },
      { q: "Do you accept damaged or out-of-circulation notes?", a: "We accept current US dollars that are no longer in circulation, subject to on-the-spot assessment. Message us on WhatsApp if you have questions about a specific note." },
      { q: "Do you do international transfers?", a: "Yes. We offer international transfers and supplier payments in foreign currency. We have special terms for companies." },
      { q: "Do you accept Pix? (Brazilian tourists)", a: "Yes. Brazilian tourists can pay with **Pix** in reais and receive Chilean pesos or US dollars in cash, instantly and in person at the office (by scanning a QR code). More information on [our Pix page](/pix)." },
      { q: "What documents do I need to exchange US dollars or other currencies in Chile?", a: "For smaller amounts the exchange is usually straightforward: you arrive with your cash, accept the price and receive your money in minutes. For larger amounts, Chile's anti-money-laundering rules — overseen by the [Financial Analysis Unit (UAF)](https://www.uaf.cl) — require identifying the customer, so you may be asked for your ID card or passport. It's a legal requirement that applies to all registered currency exchanges in Chile." },
      { q: "What's the difference between the buy price and the sell price?", a: "The buy price is what the currency exchange pays you for the currency: for example, when you hand over US dollars and receive Chilean pesos. The sell price is what it charges you for it: when you hand over pesos and take US dollars. The difference between the two is called the spread, and it's the margin every currency exchange operates on; that's why the sell price is always higher than the buy price." },
      { q: "How is the exchange rate set in Chile?", a: "In Chile the exchange rate is flexible: the price of the US dollar and other currencies is set by market supply and demand, which is why it changes constantly throughout the day. As an official reference, the [Central Bank of Chile](https://www.bcentral.cl) publishes the “observed dollar” each business day, an average of transactions on the formal market. Currency exchanges set their buy and sell prices based on that market." },
      { q: "Are there limits to exchanging cash in Chile?", a: "Exchanging cash is legal and there is no general limit by amount. However, transactions above certain thresholds are subject to the anti-money-laundering rules overseen by the Financial Analysis Unit (UAF): the currency exchange must identify the customer and record the transaction. If you plan to exchange a significant sum, we recommend messaging us first on WhatsApp to confirm note availability and speed up service at the office." },
      { q: "How does a currency exchange work?", a: "A currency exchange buys and sells foreign currency to the public. It publishes a buy price and a sell price for each currency and earns its margin from the difference between the two (the spread), not from additional fees. The transaction is immediate: you hand over one currency and receive the other on the spot. In Chile, currency exchanges operate registered with the Financial Analysis Unit and apply identity verification on larger transactions." },
      { q: "How do I get to the office?", a: "We're at Av. Pedro de Valdivia 020, Providencia. Steps from the exit of the Pedro de Valdivia metro (Line 1). Also close to Costanera Center." },
      { q: "Does Gamaex send bulk emails or make marketing calls?", a: "No. Gamaex **does not send bulk emails, messages or make phone calls for advertising or promotional purposes**. We don't buy contact databases and we don't reach out to people who haven't contacted us first. We only reply to those who message us through their own channels (WhatsApp, phone, email or the website form). If you received a message claiming to be from Gamaex and you didn't start the conversation, it most likely did not come from us." },
    ],
  },
  ubicacion: {
    label: "Come see us", title: "Av. Pedro de Valdivia 020, Providencia",
    subtitle: "Steps from the Pedro de Valdivia metro (Line 1). Walk-in service, no appointment.",
    rowAddress: "Address", rowMetro: "Metro", rowPhone: "Phone",
    addressValue: "Av. Pedro de Valdivia 020, Providencia, Santiago",
    metroValue: "Pedro de Valdivia · Line 1 (50 m away)",
    hoursWeek: "Mon – Fri", hoursSat: "Saturday", hoursSun: "Sunday",
    weekTime: "9:00 — 17:00", satTime: "9:00 — 13:00", closed: "Closed",
    seeMaps: "📍 View on Maps", cotizarNow: "💬 Get a quote", call: "📞 Call",
  },
  contacto: {
    label: "Contact", title: "Leave us your details",
    subtitle: "Fill out the form and we'll get back to you with the final price and availability. Simpler and tidier than messaging on WhatsApp.",
  },
  form: {
    question: "What do you need?", wantBuy: "I want to buy", wantSell: "I want to sell",
    currency: "Currency", amountPre: "Amount (in ", amountPost: ")", amountPlaceholder: "e.g. 1,000",
    name: "First name", lastName: "Last name", email: "Email", phone: "Phone / WhatsApp",
    message: "Message", optional: "(optional)", messagePlaceholder: "Anything we should know? (optional)",
    emailPlaceholder: "you@email.com", phonePlaceholder: "+56 9 ...",
    send: "Send request", sending: "Sending…",
    legal: "Your details are only used to contact you about this quote.",
    successTitle: "Request sent!",
    successBody: "We got your details. We'll contact you shortly with the final price and availability. Thank you for choosing Gamaex.",
    sendAnother: "Send another request", goHome: "Go to home",
    errGeneric: "We couldn't send your request. Please try again.",
    errConn: "Connection problem. Check your internet and try again.",
  },
  quicklinks: {
    title: "Popular searches",
    links: [
      "Buy US dollars in Santiago", "Sell US dollars in Santiago",
      "Buy US dollars in Providencia", "Sell US dollars in Providencia",
      "Dollar price today", "Dollar exchange rate today in Chile",
      "Exchange dollars for pesos", "Buy dollars with no commission",
      "Best exchange rate in Santiago", "Buy euros in Santiago",
      "Sell euros in Santiago", "Euro exchange rate",
    ].map((label, i) => ({ href: QUICKLINKS_HREFS[i]!, label })),
  },
  footer: {
    tagline: "38 years offering the best exchange rate in Santiago. Currency exchange in Providencia, steps from the Pedro de Valdivia metro.",
    colServicios: "Services", colInfo: "Information", colContacto: "Contact",
    sCambio: "Currency exchange", sTransfer: "Transfers", sPago: "Supplier payments", sCorp: "Corporate service",
    iTasas: "Today's rates", iNosotros: "About us", iAlerta: "Price alert",
    iOpiniones: "Reviews", iFaq: "FAQ", iComoLlegar: "How to get here",
    hoursLine: "Mon–Fri 9:00–17:00 · Sat 9:00–13:00",
    rights: "Gamaex Chile · Inversiones y Turismo Gamaex Chile S.A.",
    noSpam: "Gamaex does not send bulk emails or make promotional phone calls. We only respond to people who contact us directly.",
  },
  wa: {
    generic: "Hi, I'd like a quote from Gamaex.",
    bigAmount: "Hi, I'd like to ask about pricing for a larger amount.",
    faqMsg: "Hi, I have a question about Gamaex's service.",
    calc: "Hi, I'd like a quote for {amount} {from} to {to} at Gamaex. Can you confirm price and availability?",
  },
};

const pt: HomeCopy = {
  nav: {
    tasas: "Taxas", servicios: "Serviços", nosotros: "Sobre", contacto: "Contato",
    alerta: "Alerta de preço", faq: "FAQ", ubicacion: "Localização",
    openNow: "Aberto agora", closed: "Fechado",
    cotizar: "💬 Cotar", cotizarWa: "💬 Cotar pelo WhatsApp", llamarLocal: "📞 Ligar para a loja",
    openMenu: "Abrir menu", closeMenu: "Fechar menu", cliente: "Seja cliente",
  },
  hero: {
    tag: "⚡ Casa de câmbio · Providencia",
    h1Before: "Casa de câmbio em ", h1Accent: "Providencia",
    heroDesc: "38 anos de trajetória a poucos passos do metrô Pedro de Valdivia. Compra e venda de dólares, euros, reais e mais de 40 moedas.",
    badges: ["0% de comissão", "+40 moedas", "Atendimento presencial", "Sem app, sem cadastro", "Desde 1988"],
  },
  calc: {
    title: "Quanto você quer trocar hoje?",
    youGive: "Você entrega", youGet: "Você recebe", rateToday: "Taxa de referência",
    swap: "Inverter moedas",
    ctaWa: "💬 Cotar pelo WhatsApp →", ctaForm: "📝 Deixe seus dados e entramos em contato →",
    share: "🔗 Compartilhar cotação", shareCopied: "✓ Link copiado",
    secureNote: "🔒 Preço de referência · O valor final é confirmado pelo WhatsApp · Sem comissões",
    updated: "Referência",
  },
  stats: { years: "Anos de trajetória", currencies: "Moedas disponíveis", hiddenFees: "Taxas ocultas", avgOp: "Operação média" },
  tasas: {
    label: "Preços de referência", title: "Preços de referência de hoje",
    subtitle: "Os preços mudam ao longo do dia e são apenas de referência. **O preço final da sua operação é confirmado pelo WhatsApp.**",
    lastUpdate: "Referência atualizada:",
    stale: "⚠ Preços temporariamente indisponíveis — consulte pelo WhatsApp",
    empty: "Cotações indisponíveis no momento.", emptyCta: "Consultar pelo WhatsApp →",
    bigTitle: "Consulte o preço para valores maiores",
    bigSub: "Para operações de maior volume aplicamos taxa preferencial.",
    bigCta: "💬 Consultar",
    foot: "Cotação orientativa. A taxa de câmbio é determinada pela oferta e demanda do mercado; segundo o [Banco Central do Chile](https://www.bcentral.cl), o “dólar observado” publicado a cada dia útil é a referência oficial. Para confirmar o preço e operar, fale conosco diretamente.",
  },
  opiniones: {
    label: "Avaliações reais", title: "O que dizem nossos clientes",
    subtitle: `Avaliações verificadas no [Google Maps](${MAPS}) · 4,5 ★ com mais de 35 avaliações`,
    emptyReview: "Avaliação 5 estrelas no Google.",
  },
  faq: {
    label: "Perguntas frequentes", title: "O que mais nos perguntam",
    ctaText: "Tem outra pergunta? Fale conosco diretamente.", ctaBtn: "💬 Consultar pelo WhatsApp",
    items: [
      { q: "Qual é a casa de câmbio mais segura para comprar dólares em Santiago?", a: "A Gamaex tem 38 anos de trajetória em Providencia (fundada em 1987). Operamos em loja física verificável na Av. Pedro de Valdivia 020, sem entregas na rua nem intermediários. Somos uma sociedade anônima registrada (Inversiones y Turismo Gamaex Chile S.A.) com avaliações verificáveis no Google. Taxas publicadas e atendimento personalizado." },
      { q: "A Gamaex é uma casa de câmbio confiável e regulamentada?", a: "Sim. A Gamaex é a **Inversiones y Turismo Gamaex Chile S.A.**, uma casa de câmbio estabelecida na Av. Pedro de Valdivia 020, Providencia, com loja física e operação contínua desde 1987. Consta no registro público de entidades reportantes da [Unidade de Análise Financeira (UAF)](https://www.uaf.cl) na categoria casas de câmbio — o órgão que no Chile fiscaliza o setor na prevenção à lavagem de dinheiro. A isso se somam mais de três décadas de trajetória e avaliações verificáveis no Google." },
      { q: "Por que a Gamaex não aparece na CMF? Ainda assim é confiável?", a: "É normal e esperado que uma casa de câmbio não apareça na Comissão para o Mercado Financeiro (CMF): a **CMF supervisiona os bancos e o mercado cambial formal, não as casas de câmbio**. No Chile, as casas de câmbio operam legalmente e sua fiscalização na prevenção à lavagem de dinheiro cabe à [Unidade de Análise Financeira (UAF)](https://www.uaf.cl), onde a Gamaex está registrada como Inversiones y Turismo Gamaex Chile S.A., na categoria casas de câmbio. Por isso não constar na CMF não é um sinal de alerta: o que importa é ter loja física, trajetória e registro na UAF, como a Gamaex desde 1987." },
      { q: "Qual casa de câmbio está aberta hoje, sábado de manhã?", a: "A Gamaex atende aos sábados das 9:00 às 13:00 na Av. Pedro de Valdivia 020, Providencia, a poucos passos do metrô Pedro de Valdivia. Uma opção conveniente na zona nobre para trocar moeda num sábado sem ir ao centro." },
      { q: "Preciso trocar euros por pesos chilenos com uma boa taxa — para onde vou?", a: "Compramos e vendemos euros (EUR) por pesos chilenos (CLP) com taxas competitivas. Os preços em gamaex.cl são de referência e o preço final é confirmado pelo WhatsApp antes de vir. Sem taxas ocultas." },
      { q: "Vocês compram e vendem dólares?", a: "Sim. Compramos e vendemos dólares americanos (USD) e mais de 40 moedas. Os preços publicados são de referência e o preço final é confirmado pelo WhatsApp antes da operação." },
      { q: "Vocês cobram taxas adicionais?", a: "Não. Trabalhamos com preços finais. Sem taxas ocultas, sem cobranças extras. O preço que você vê é o preço da operação." },
      { q: "Posso cotar pelo WhatsApp antes de ir?", a: "Sim. Envie uma mensagem com o valor e as moedas que quer operar. Confirmamos preço e disponibilidade na hora." },
      { q: "Com quais moedas vocês trabalham?", a: "Mais de 40 moedas: dólar (USD), euro (EUR), real brasileiro (BRL), libra esterlina (GBP), iene japonês (JPY), peso argentino (ARS), franco suíço (CHF) e muitas outras." },
      { q: "Quais são os horários de atendimento?", a: "Segunda a sexta das 9:00 às 17:00 e sábados das 9:00 às 13:00. Domingos e feriados fechado." },
      { q: "Vocês aceitam notas danificadas ou fora de circulação?", a: "Aceitamos dólares correntes que não estejam mais em circulação, sujeito a avaliação no momento. Fale conosco pelo WhatsApp se tiver dúvidas sobre uma nota específica." },
      { q: "Vocês fazem transferências internacionais?", a: "Sim. Oferecemos transferências internacionais e pagamento a fornecedores em moeda estrangeira. Temos condições especiais para empresas." },
      { q: "Vocês aceitam Pix? (turistas brasileiros)", a: "Sim. Os turistas brasileiros podem pagar com **Pix** em reais e receber pesos chilenos ou dólares em dinheiro, na hora e presencialmente na loja (escaneando um QR Code). Mais informações na [nossa página do Pix](/pix)." },
      { q: "Quais documentos preciso para trocar dólares ou outras moedas no Chile?", a: "Para valores menores a troca costuma ser direta: você chega com o dinheiro, aceita o preço e recebe em minutos. Para valores mais altos, as regras chilenas de prevenção à lavagem de dinheiro — fiscalizadas pela [Unidade de Análise Financeira (UAF)](https://www.uaf.cl) — exigem identificar o cliente, então podem pedir o documento de identidade ou passaporte. É uma exigência legal que se aplica a todas as casas de câmbio registradas no Chile." },
      { q: "Qual é a diferença entre o preço de compra e o de venda?", a: "O preço de compra é o valor pelo qual a casa de câmbio compra a moeda de você: por exemplo, quando você entrega dólares e recebe pesos chilenos. O preço de venda é o valor pelo qual ela vende: quando você entrega pesos e leva dólares. A diferença entre os dois é chamada de spread e é a margem com que toda casa de câmbio opera; por isso o preço de venda é sempre mais alto que o de compra." },
      { q: "Como é determinada a taxa de câmbio no Chile?", a: "No Chile a taxa de câmbio é flexível: o preço do dólar e das demais moedas é determinado pela oferta e demanda do mercado e, por isso, varia constantemente ao longo do dia. Como referência oficial, o [Banco Central do Chile](https://www.bcentral.cl) publica a cada dia útil o “dólar observado”, uma média das operações do mercado formal. As casas de câmbio definem seus preços de compra e venda a partir desse mercado." },
      { q: "Há limites para trocar dinheiro em espécie no Chile?", a: "Trocar dinheiro em espécie é legal e não existe uma proibição geral por valor. No entanto, as operações que superam certos limites estão sujeitas às regras de prevenção à lavagem de dinheiro fiscalizadas pela Unidade de Análise Financeira (UAF): a casa de câmbio deve identificar o cliente e registrar a operação. Se você planeja trocar uma quantia importante, recomendamos falar conosco antes pelo WhatsApp para confirmar a disponibilidade de notas e agilizar o atendimento na loja." },
      { q: "Como funciona uma casa de câmbio?", a: "Uma casa de câmbio compra e vende moeda estrangeira ao público. Publica um preço de compra e um preço de venda para cada moeda e obtém sua margem da diferença entre os dois (o spread), não de taxas adicionais. A operação é imediata: você entrega uma moeda e recebe a outra na hora. No Chile, as casas de câmbio operam registradas na Unidade de Análise Financeira e aplicam verificação de identidade em operações de maior valor." },
      { q: "Como chego à loja?", a: "Estamos na Av. Pedro de Valdivia 020, Providencia. A poucos passos da saída do metrô Pedro de Valdivia (Linha 1). Também perto do Costanera Center." },
      { q: "A Gamaex envia e-mails em massa ou faz ligações de publicidade?", a: "Não. A Gamaex **não envia e-mails em massa, mensagens nem faz ligações telefônicas com fins publicitários ou promocionais**. Não compramos bases de dados nem entramos em contato com pessoas que não falaram conosco primeiro. Só respondemos a quem nos escreve pelos próprios meios (WhatsApp, telefone, e-mail ou o formulário do site). Se você recebeu uma mensagem que diz ser da Gamaex e não iniciou o contato, provavelmente não veio de nós." },
    ],
  },
  ubicacion: {
    label: "Venha nos visitar", title: "Av. Pedro de Valdivia 020, Providencia",
    subtitle: "A poucos passos do metrô Pedro de Valdivia (Linha 1). Atendimento presencial, sem agendamento.",
    rowAddress: "Endereço", rowMetro: "Metrô", rowPhone: "Telefone",
    addressValue: "Av. Pedro de Valdivia 020, Providencia, Santiago",
    metroValue: "Pedro de Valdivia · Linha 1 (a 50 metros)",
    hoursWeek: "Seg – Sex", hoursSat: "Sábado", hoursSun: "Domingo",
    weekTime: "9:00 — 17:00", satTime: "9:00 — 13:00", closed: "Fechado",
    seeMaps: "📍 Ver no Maps", cotizarNow: "💬 Cotar agora", call: "📞 Ligar",
  },
  contacto: {
    label: "Contato", title: "Deixe seus dados",
    subtitle: "Preencha o formulário e entramos em contato com o preço final e a disponibilidade. Mais simples e organizado que escrever no WhatsApp.",
  },
  form: {
    question: "O que você precisa?", wantBuy: "Quero comprar", wantSell: "Quero vender",
    currency: "Moeda", amountPre: "Valor (em ", amountPost: ")", amountPlaceholder: "Ex: 1.000",
    name: "Nome", lastName: "Sobrenome", email: "Email", phone: "Telefone / WhatsApp",
    message: "Mensagem", optional: "(opcional)", messagePlaceholder: "Algo que devemos saber? (opcional)",
    emailPlaceholder: "voce@email.com", phonePlaceholder: "+56 9 ...",
    send: "Enviar solicitação", sending: "Enviando…",
    legal: "Seus dados são usados apenas para entrar em contato sobre esta cotação.",
    successTitle: "Solicitação enviada!",
    successBody: "Recebemos seus dados. Entraremos em contato em breve com o preço final e a disponibilidade. Obrigado por escolher a Gamaex.",
    sendAnother: "Enviar outra solicitação", goHome: "Ir para o início",
    errGeneric: "Não foi possível enviar a solicitação. Tente novamente.",
    errConn: "Problema de conexão. Verifique sua internet e tente novamente.",
  },
  quicklinks: {
    title: "Buscas frequentes",
    links: [
      "Comprar dólares em Santiago", "Vender dólares em Santiago",
      "Comprar dólares em Providencia", "Vender dólares em Providencia",
      "Preço do dólar hoje", "Câmbio do dólar hoje no Chile",
      "Trocar dólares por pesos", "Comprar dólares sem comissão",
      "Melhor taxa de câmbio em Santiago", "Comprar euros em Santiago",
      "Vender euros em Santiago", "Taxa de câmbio do euro",
    ].map((label, i) => ({ href: QUICKLINKS_HREFS[i]!, label })),
  },
  footer: {
    tagline: "38 anos oferecendo a melhor taxa de câmbio em Santiago. Casa de câmbio em Providencia, a poucos passos do metrô Pedro de Valdivia.",
    colServicios: "Serviços", colInfo: "Informações", colContacto: "Contato",
    sCambio: "Câmbio de moedas", sTransfer: "Transferências", sPago: "Pagamento a fornecedores", sCorp: "Atendimento corporativo",
    iTasas: "Taxas de hoje", iNosotros: "Quem somos", iAlerta: "Alerta de preço",
    iOpiniones: "Avaliações", iFaq: "FAQ", iComoLlegar: "Como chegar",
    hoursLine: "Seg–Sex 9:00–17:00 · Sáb 9:00–13:00",
    rights: "Gamaex Chile · Inversiones y Turismo Gamaex Chile S.A.",
    noSpam: "A Gamaex não envia e-mails em massa nem faz ligações telefônicas com fins publicitários. Só respondemos a quem entra em contato conosco diretamente.",
  },
  wa: {
    generic: "Olá, gostaria de uma cotação na Gamaex.",
    bigAmount: "Olá, gostaria de consultar o preço para um valor maior.",
    faqMsg: "Olá, tenho uma dúvida sobre o serviço da Gamaex.",
    calc: "Olá, gostaria de cotar {amount} {from} para {to} na Gamaex. Podem confirmar preço e disponibilidade?",
  },
};

export const homeCopy: Record<Locale, HomeCopy> = { es, en, pt };
