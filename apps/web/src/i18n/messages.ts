// ─── Sistema de i18n minimalista basado en cookie ─────────────────────────────
//
// - Español (es) es el default y lo que ven Google y usuarios sin cookie
// - Inglés (en) y Portugués BR (pt) se activan cuando el usuario elige la bandera
// - Los 85 landings SEO en español no se traducen (son SEO chile específico)
// - Sólo se traducen las páginas útiles: cotizar, reservar, voucher, aceptación,
//   y el nav compartido
//
// Uso servidor: const locale = await getLocale(); const t = messages[locale];
// Uso cliente:  const locale = useLocale(); const t = messages[locale];

export const LOCALES = ["es", "en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE = "gamaex_locale";

export interface LocaleInfo {
  code: Locale;
  flag: string;
  label: string;
  ariaLabel: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  es: { code: "es", flag: "🇪🇸", label: "ES", ariaLabel: "Español" },
  en: { code: "en", flag: "🇺🇸", label: "EN", ariaLabel: "English" },
  pt: { code: "pt", flag: "🇧🇷", label: "PT", ariaLabel: "Português (Brasil)" },
};

// Tipo estricto para autocompletado y detección de claves faltantes.
export interface MessagesShape {
  nav: {
    tasas: string;
    servicios: string;
    nosotros: string;
    cotizar: string;
    reservar: string;
    alertaPrecio: string;
    faq: string;
    ubicacion: string;
    contactar: string;
  };
  cotizar: {
    title: string;
    subtitle: string;
    back: string;
    formTitle: string;
    operationLabel: string;
    opBuy: string;
    opSell: string;
    currency: string;
    amount: string;
    refTitle: string;
    refOperation: string;
    refRate: string;
    refTotal: string;
    refDisclaimer: string;
    contactSection: string;
    firstName: string;
    lastNameOptional: string;
    email: string;
    emailInvalid: string;
    whatsapp: string;
    phoneInvalid: string;
    messageOptional: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    consent: string;
    successBadge: string;
    successTitleWithName: string;
    successTitleNoName: string;
    successBody: string;
    successReferentialTitle: string;
    successReferentialDisclaimer: string;
    ctaReservar: string;
    ctaHome: string;
    error: string;
  };
  reservar: {
    title: string;
    subtitle: string;
    back: string;
    quoterTitle: string;
    operation: string;
    opBuy: string;
    opSell: string;
    opBuyDesc: string;
    opSellDesc: string;
    currency: string;
    amount: string;
    todayRate: string;
    priceConfirmedByGamaex: string;
    summaryTitle: string;
    summaryTotal: string;
    summaryDeposit: string;
    summaryBalance: string;
    warn: string;
    ctaWhatsapp: string;
    ctaFinePrint: string;
    howItWorksTitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    whatsappMsg: string; // multi-línea con placeholders {op} {amount} {code} {rate} {total} {deposit}
  };
  voucher: {
    titlePaid: string;
    titlePending: string;
    subtitlePaid: string;
    subtitlePending: string;
    badgePaid: string;
    badgePending: string;
    folio: string;
    operationHeader: string;
    holderHeader: string;
    pickupHeader: string;
    depositPaid: string;
    balanceOnPickup: string;
    name: string;
    rut: string;
    email: string;
    whatsapp: string;
    address: string;
    hours: string;
    pickupFrom: string;
    pickupBefore: string;
    bring: string;
    bringValue: string; // "Cédula + {balance} en CLP"
    ctaWhatsapp: string;
    ctaMaps: string;
    finePrint: string; // con placeholder {deposit}
    paymentFailedTitle: string;
    paymentFailedBody: string;
    ctaRetry: string;
    notFoundTitle: string;
    notFoundBody: string;
    ctaWA: string;
  };
  accept: {
    title: string;
    subtitle: string; // con {name}
    alreadyPaidTitle: string;
    alreadyPaidBody: string;
    ctaViewVoucher: string;
    expiredTitle: string;
    expiredBody: string;
    invalidLinkTitle: string;
    invalidLinkBody: string;
    ctaBackQuote: string;
    operationHeader: string;
    holderHeader: string;
    conditionsHeader: string;
    priceFrozen: string;
    pickupWindow: string;
    penaltyClause: string;
    noShowClause: string;
    consent: string;
    ctaAccept: string;
    ctaAcceptSubmitting: string;
    ctaFinePrint: string;
    error: string;
    dataMismatchHelp: string;
    holderName: string;
    priceClosed: string;
    total: string;
    depositNow: string;
    balancePickup: string;
    paymentFailedInline: string;
  };
  common: {
    switchLanguage: string;
  };
}

const es: MessagesShape = {
  nav: {
    tasas: "Tasas",
    servicios: "Servicios",
    nosotros: "Nosotros",
    cotizar: "Cotizar",
    reservar: "Reservar",
    alertaPrecio: "Alerta de precio",
    faq: "FAQ",
    ubicacion: "Ubicación",
    contactar: "Contactar",
  },
  cotizar: {
    title: "Solicita tu cotización",
    subtitle:
      "Llena el formulario y te contactamos por WhatsApp con el precio final y disponibilidad. Sin costo, sin compromiso.",
    back: "← Volver",
    formTitle: "Cotizador",
    operationLabel: "Operación",
    opBuy: "Comprar divisa",
    opSell: "Vender divisa",
    currency: "Moneda",
    amount: "Monto",
    refTitle: "Referencial de hoy",
    refOperation: "Operación",
    refRate: "Tasa",
    refTotal: "Total estimado",
    refDisclaimer: "Precio referencial. El definitivo te lo confirmamos al contactarte.",
    contactSection: "Tus datos de contacto",
    firstName: "Nombre",
    lastNameOptional: "Apellido (opcional)",
    email: "Email",
    emailInvalid: "Email inválido",
    whatsapp: "WhatsApp",
    phoneInvalid: "Teléfono inválido",
    messageOptional: "Mensaje (opcional)",
    messagePlaceholder: "Ej: necesito para viaje el 5 de agosto, monto flexible.",
    submit: "Solicitar cotización",
    submitting: "Enviando…",
    consent:
      "Al enviar aceptas que Gamaex te contacte por email y WhatsApp con la cotización. No compartimos tus datos con terceros.",
    successBadge: "✓ Cotización recibida",
    successTitleWithName: "Gracias, {name}. Te contactamos muy pronto.",
    successTitleNoName: "Gracias. Te contactamos muy pronto.",
    successBody:
      "Un ejecutivo de Gamaex te escribirá por WhatsApp al {phone} con el precio final y los pasos para operar. Horario de contacto: Lun–Vie 9:00–17:00 · Sáb 9:00–13:00.",
    successReferentialTitle: "Referencial (precio del día)",
    successReferentialDisclaimer:
      "Este valor puede variar hasta el momento del cierre. El precio final lo confirma Gamaex.",
    ctaReservar: "¿Prefieres reservar ahora? →",
    ctaHome: "Volver al inicio",
    error: "No pudimos registrar tu cotización. Intenta de nuevo.",
  },
  reservar: {
    title: "Reservar tu operación",
    subtitle:
      "Cotiza acá y cierra por WhatsApp con Gamaex. Al confirmar el precio te enviamos un link único para aceptar las condiciones y pagar la seña del 10 % con Mercado Pago.",
    back: "← Volver",
    quoterTitle: "Cotizador",
    operation: "Operación",
    opBuy: "Comprar divisa",
    opSell: "Vender divisa",
    opBuyDesc: "Traes CLP y te llevas la divisa extranjera.",
    opSellDesc: "Traes la divisa extranjera y te llevas CLP.",
    currency: "Moneda",
    amount: "Monto",
    todayRate: "Tasa referencia hoy",
    priceConfirmedByGamaex:
      "El precio final lo confirma Gamaex por WhatsApp antes de emitir tu link de pago.",
    summaryTitle: "Cotización referencial",
    summaryTotal: "Total estimado",
    summaryDeposit: "Seña 10 %",
    summaryBalance: "Saldo al retirar",
    warn:
      "Este cálculo es referencial. Al cerrar por WhatsApp, el precio queda congelado para tu retiro (entre 24 y 72 hrs). La seña opera como cláusula penal: si no retiras, queda a favor de Gamaex por el perjuicio del stock reservado.",
    ctaWhatsapp: "💬 Cerrar por WhatsApp con Gamaex →",
    ctaFinePrint:
      "Al confirmar precio por WhatsApp, Gamaex te enviará un link único donde aceptas las condiciones y pagas la seña por Mercado Pago. La operación queda cerrada al pagar.",
    howItWorksTitle: "Cómo funciona",
    step1: "Cotiza acá arriba con la moneda y el monto que necesitas.",
    step2: "Cierra por WhatsApp con Gamaex (confirmamos precio y stock).",
    step3: "Recibes un link único con las condiciones cerradas y pagas la seña 10 % por Mercado Pago.",
    step4: "Retiras entre 24 y 72 horas después del pago, en Av. Pedro de Valdivia 020, con cédula.",
    whatsappMsg:
      "Hola, quiero reservar una operación en Gamaex.\n\n{op} {amount} {code}\nTasa referencial: {rate} por 1 {code}\nTotal estimado: {total}\nSeña 10 %: {deposit}\n\nConfírmame precio final y te pago la seña por Mercado Pago.",
  },
  voucher: {
    titlePaid: "¡Listo! Tu operación está reservada",
    titlePending: "Tu reserva está pendiente",
    subtitlePaid: "Guarda este comprobante o toma una captura. Lo necesitarás al retirar.",
    subtitlePending:
      "Esperando confirmación del pago. Esta página se actualiza sola cuando llegue.",
    badgePaid: "✓ Reserva confirmada",
    badgePending: "Pago pendiente",
    folio: "FOLIO",
    operationHeader: "Operación",
    holderHeader: "Titular",
    pickupHeader: "Retiro",
    depositPaid: "Seña pagada",
    balanceOnPickup: "Saldo al retirar",
    name: "Nombre",
    rut: "RUT",
    email: "Email",
    whatsapp: "WhatsApp",
    address: "Dirección",
    hours: "Horario",
    pickupFrom: "Retirar desde",
    pickupBefore: "Retirar antes de",
    bring: "Trae",
    bringValue: "Cédula + {balance} en CLP",
    ctaWhatsapp: "💬 Enviar folio por WhatsApp",
    ctaMaps: "Cómo llegar →",
    finePrint:
      "La seña ({deposit}) opera como cláusula penal y se descuenta del total al retirar. El precio quedó congelado con esta reserva. Si no retiras dentro de la ventana de 24 a 72 horas, la reserva expira automáticamente y la seña queda a favor de Gamaex como indemnización por el perjuicio.",
    paymentFailedTitle: "El pago no se completó.",
    paymentFailedBody:
      "Tu reserva no quedó confirmada. Puedes intentarlo nuevamente desde el cotizador.",
    ctaRetry: "Volver a reservar",
    notFoundTitle: "No encontramos tu reserva.",
    notFoundBody:
      "Si acabas de pagar, dale unos segundos y refresca. Si el problema persiste, escríbenos por WhatsApp con tu folio.",
    ctaWA: "💬 Escribir por WhatsApp",
  },
  accept: {
    title: "Confirma tu reserva",
    subtitle:
      "Estas son las condiciones que cerramos por WhatsApp con {name}. Revisa, acepta y paga la seña para dejar la operación en firme.",
    alreadyPaidTitle: "Esta reserva ya está pagada.",
    alreadyPaidBody: "Puedes ver tu comprobante y datos de retiro.",
    ctaViewVoucher: "Ver mi comprobante →",
    expiredTitle: "Esta reserva ya no está vigente.",
    expiredBody: "Contáctanos por WhatsApp para armar una nueva.",
    invalidLinkTitle: "Este link no es válido o expiró.",
    invalidLinkBody: "Contáctanos por WhatsApp para que te enviemos un nuevo link.",
    ctaBackQuote: "Volver a cotizar",
    operationHeader: "Operación",
    holderHeader: "Titular",
    conditionsHeader: "Condiciones",
    priceFrozen: "El precio queda congelado con esta reserva. Es un cierre de negocio.",
    pickupWindow:
      "Retira en Av. Pedro de Valdivia 020, Providencia, entre 24 y 72 horas después del pago, con cédula.",
    penaltyClause:
      "La seña no es reembolsable — opera como cláusula penal (Cód. Civil chileno art. 1535).",
    noShowClause:
      "Si no retiras dentro de la ventana o cambias las condiciones cerradas, la seña queda a favor de Gamaex como indemnización por el perjuicio de haber reservado stock que dejó de venderse.",
    consent:
      "He leído y acepto expresamente las condiciones de esta reserva, incluyendo la cláusula penal sobre la seña. Al presionar \"Pagar seña\" quedará constancia de mi aceptación.",
    ctaAccept: "Acepto y pago {deposit} de seña →",
    ctaAcceptSubmitting: "Redirigiendo a Mercado Pago…",
    ctaFinePrint:
      "Serás redirigido a Mercado Pago para pagar la seña. Una vez confirmado el pago, recibirás tu comprobante con folio para el retiro.",
    error: "No pudimos procesar tu aceptación. Intenta de nuevo.",
    dataMismatchHelp: "Si algún dato no calza, avísale a Gamaex por WhatsApp antes de aceptar.",
    holderName: "Nombre",
    priceClosed: "Precio cerrado",
    total: "Total operación",
    depositNow: "Seña a pagar ahora (10 %)",
    balancePickup: "Saldo al retirar",
    paymentFailedInline: "El pago anterior no se completó. Puedes reintentar.",
  },
  common: {
    switchLanguage: "Cambiar idioma",
  },
};

const en: MessagesShape = {
  nav: {
    tasas: "Rates",
    servicios: "Services",
    nosotros: "About us",
    cotizar: "Get a quote",
    reservar: "Book",
    alertaPrecio: "Price alert",
    faq: "FAQ",
    ubicacion: "Location",
    contactar: "Contact",
  },
  cotizar: {
    title: "Request a quote",
    subtitle:
      "Fill in the form and we'll contact you on WhatsApp with the final price and availability. Free, no strings attached.",
    back: "← Back",
    formTitle: "Quote",
    operationLabel: "Operation",
    opBuy: "Buy currency",
    opSell: "Sell currency",
    currency: "Currency",
    amount: "Amount",
    refTitle: "Today's reference",
    refOperation: "Operation",
    refRate: "Rate",
    refTotal: "Estimated total",
    refDisclaimer: "Reference price only. The final one is confirmed by Gamaex when we contact you.",
    contactSection: "Your contact details",
    firstName: "First name",
    lastNameOptional: "Last name (optional)",
    email: "Email",
    emailInvalid: "Invalid email",
    whatsapp: "WhatsApp",
    phoneInvalid: "Invalid phone",
    messageOptional: "Message (optional)",
    messagePlaceholder: "e.g. I need it for a trip on August 5th, flexible amount.",
    submit: "Request quote",
    submitting: "Sending…",
    consent:
      "By submitting, you agree that Gamaex may contact you by email and WhatsApp about the quote. We don't share your data with third parties.",
    successBadge: "✓ Quote received",
    successTitleWithName: "Thank you, {name}. We'll contact you very soon.",
    successTitleNoName: "Thanks. We'll contact you very soon.",
    successBody:
      "A Gamaex representative will WhatsApp you at {phone} with the final price and next steps. Contact hours: Mon–Fri 9:00–17:00 · Sat 9:00–13:00.",
    successReferentialTitle: "Reference (today's price)",
    successReferentialDisclaimer:
      "This may change until closing. The final price is confirmed by Gamaex.",
    ctaReservar: "Want to book right now? →",
    ctaHome: "Back to home",
    error: "We couldn't register your quote. Please try again.",
  },
  reservar: {
    title: "Book your operation",
    subtitle:
      "Get a quote here and close the deal by WhatsApp with Gamaex. Once we confirm the price we'll send you a single link to accept the terms and pay the 10% deposit with Mercado Pago.",
    back: "← Back",
    quoterTitle: "Quote",
    operation: "Operation",
    opBuy: "Buy currency",
    opSell: "Sell currency",
    opBuyDesc: "You bring CLP and take the foreign currency.",
    opSellDesc: "You bring the foreign currency and take CLP.",
    currency: "Currency",
    amount: "Amount",
    todayRate: "Today's reference rate",
    priceConfirmedByGamaex:
      "The final price is confirmed by Gamaex on WhatsApp before we issue your payment link.",
    summaryTitle: "Reference quote",
    summaryTotal: "Estimated total",
    summaryDeposit: "Deposit 10%",
    summaryBalance: "Balance on pickup",
    warn:
      "This is a reference calculation. When you close on WhatsApp the price is locked in for pickup (24–72 hrs). The deposit acts as a penalty clause: if you don't pick up, it stays with Gamaex as compensation for the reserved stock.",
    ctaWhatsapp: "💬 Close the deal on WhatsApp with Gamaex →",
    ctaFinePrint:
      "After confirming the price by WhatsApp, Gamaex will send you a single link where you accept the terms and pay the deposit via Mercado Pago. The operation is closed on payment.",
    howItWorksTitle: "How it works",
    step1: "Quote above with the currency and amount you need.",
    step2: "Close the deal on WhatsApp with Gamaex (we confirm price and stock).",
    step3: "You receive a single link with the locked-in terms and pay the 10% deposit via Mercado Pago.",
    step4: "You pick up between 24 and 72 hours after payment at Av. Pedro de Valdivia 020, with ID.",
    whatsappMsg:
      "Hi, I want to book an operation at Gamaex.\n\n{op} {amount} {code}\nReference rate: {rate} per 1 {code}\nEstimated total: {total}\n10% deposit: {deposit}\n\nPlease confirm the final price and I'll pay the deposit via Mercado Pago.",
  },
  voucher: {
    titlePaid: "All set! Your operation is booked",
    titlePending: "Your booking is pending",
    subtitlePaid: "Save this receipt or take a screenshot. You'll need it at pickup.",
    subtitlePending:
      "Waiting for payment confirmation. This page updates itself when it arrives.",
    badgePaid: "✓ Booking confirmed",
    badgePending: "Payment pending",
    folio: "REF",
    operationHeader: "Operation",
    holderHeader: "Holder",
    pickupHeader: "Pickup",
    depositPaid: "Deposit paid",
    balanceOnPickup: "Balance on pickup",
    name: "Name",
    rut: "RUT (ID)",
    email: "Email",
    whatsapp: "WhatsApp",
    address: "Address",
    hours: "Hours",
    pickupFrom: "Pick up from",
    pickupBefore: "Pick up before",
    bring: "Bring",
    bringValue: "ID + {balance} in CLP",
    ctaWhatsapp: "💬 Send reference by WhatsApp",
    ctaMaps: "Directions →",
    finePrint:
      "The deposit ({deposit}) acts as a penalty clause and is deducted from the total at pickup. The price was locked in with this booking. If you don't pick up within the 24–72 hour window, the booking expires automatically and the deposit stays with Gamaex as compensation.",
    paymentFailedTitle: "The payment didn't go through.",
    paymentFailedBody:
      "Your booking wasn't confirmed. You can try again from the quote page.",
    ctaRetry: "Book again",
    notFoundTitle: "We couldn't find your booking.",
    notFoundBody:
      "If you just paid, give it a few seconds and refresh. If the problem persists, WhatsApp us with your reference.",
    ctaWA: "💬 Message on WhatsApp",
  },
  accept: {
    title: "Confirm your booking",
    subtitle:
      "These are the terms we agreed on WhatsApp with {name}. Review, accept and pay the deposit to lock in the operation.",
    alreadyPaidTitle: "This booking is already paid.",
    alreadyPaidBody: "You can see your receipt and pickup details.",
    ctaViewVoucher: "View my receipt →",
    expiredTitle: "This booking is no longer active.",
    expiredBody: "Contact us on WhatsApp to arrange a new one.",
    invalidLinkTitle: "This link is invalid or expired.",
    invalidLinkBody: "Contact us on WhatsApp so we can send you a new link.",
    ctaBackQuote: "Back to quote",
    operationHeader: "Operation",
    holderHeader: "Holder",
    conditionsHeader: "Terms",
    priceFrozen: "The price is locked in with this booking. It's a closed deal.",
    pickupWindow:
      "Pick up at Av. Pedro de Valdivia 020, Providencia, between 24 and 72 hours after payment, with ID.",
    penaltyClause:
      "The deposit is non-refundable — it acts as a penalty clause (Chilean Civil Code art. 1535).",
    noShowClause:
      "If you don't pick up within the window or change the agreed terms, the deposit stays with Gamaex as compensation for reserving stock that couldn't be sold.",
    consent:
      "I have read and expressly accept the terms of this booking, including the penalty clause on the deposit. Pressing \"Pay deposit\" will leave a record of my acceptance.",
    ctaAccept: "Accept and pay {deposit} deposit →",
    ctaAcceptSubmitting: "Redirecting to Mercado Pago…",
    ctaFinePrint:
      "You'll be redirected to Mercado Pago to pay the deposit. Once payment is confirmed you'll receive your receipt with a reference number for pickup.",
    error: "We couldn't process your acceptance. Please try again.",
    dataMismatchHelp: "If any detail doesn't match, WhatsApp Gamaex before accepting.",
    holderName: "Name",
    priceClosed: "Locked-in price",
    total: "Total operation",
    depositNow: "Deposit to pay now (10%)",
    balancePickup: "Balance on pickup",
    paymentFailedInline: "The previous payment didn't go through. You can retry.",
  },
  common: {
    switchLanguage: "Change language",
  },
};

const pt: MessagesShape = {
  nav: {
    tasas: "Taxas",
    servicios: "Serviços",
    nosotros: "Sobre nós",
    cotizar: "Cotar",
    reservar: "Reservar",
    alertaPrecio: "Alerta de preço",
    faq: "FAQ",
    ubicacion: "Localização",
    contactar: "Contato",
  },
  cotizar: {
    title: "Solicite sua cotação",
    subtitle:
      "Preencha o formulário e entramos em contato pelo WhatsApp com o preço final e disponibilidade. Sem custo, sem compromisso.",
    back: "← Voltar",
    formTitle: "Cotador",
    operationLabel: "Operação",
    opBuy: "Comprar moeda",
    opSell: "Vender moeda",
    currency: "Moeda",
    amount: "Valor",
    refTitle: "Referência de hoje",
    refOperation: "Operação",
    refRate: "Cotação",
    refTotal: "Total estimado",
    refDisclaimer: "Preço referencial. O definitivo é confirmado pela Gamaex ao contatar você.",
    contactSection: "Seus dados de contato",
    firstName: "Nome",
    lastNameOptional: "Sobrenome (opcional)",
    email: "E-mail",
    emailInvalid: "E-mail inválido",
    whatsapp: "WhatsApp",
    phoneInvalid: "Telefone inválido",
    messageOptional: "Mensagem (opcional)",
    messagePlaceholder: "Ex.: preciso para viagem em 5 de agosto, valor flexível.",
    submit: "Solicitar cotação",
    submitting: "Enviando…",
    consent:
      "Ao enviar você aceita que a Gamaex entre em contato por e-mail e WhatsApp com a cotação. Não compartilhamos seus dados com terceiros.",
    successBadge: "✓ Cotação recebida",
    successTitleWithName: "Obrigado, {name}. Entraremos em contato em breve.",
    successTitleNoName: "Obrigado. Entraremos em contato em breve.",
    successBody:
      "Um executivo da Gamaex enviará mensagem no WhatsApp {phone} com o preço final e os próximos passos. Horário de contato: Seg–Sex 9h00–17h00 · Sáb 9h00–13h00.",
    successReferentialTitle: "Referência (preço do dia)",
    successReferentialDisclaimer:
      "Este valor pode variar até o fechamento. O preço final é confirmado pela Gamaex.",
    ctaReservar: "Prefere reservar agora? →",
    ctaHome: "Voltar ao início",
    error: "Não conseguimos registrar sua cotação. Tente novamente.",
  },
  reservar: {
    title: "Reserve sua operação",
    subtitle:
      "Cote aqui e feche pelo WhatsApp com a Gamaex. Ao confirmar o preço enviamos um link único para aceitar as condições e pagar o sinal de 10% pelo Mercado Pago.",
    back: "← Voltar",
    quoterTitle: "Cotador",
    operation: "Operação",
    opBuy: "Comprar moeda",
    opSell: "Vender moeda",
    opBuyDesc: "Você traz CLP e leva a moeda estrangeira.",
    opSellDesc: "Você traz a moeda estrangeira e leva CLP.",
    currency: "Moeda",
    amount: "Valor",
    todayRate: "Cotação de referência hoje",
    priceConfirmedByGamaex:
      "O preço final é confirmado pela Gamaex no WhatsApp antes de emitir seu link de pagamento.",
    summaryTitle: "Cotação referencial",
    summaryTotal: "Total estimado",
    summaryDeposit: "Sinal 10%",
    summaryBalance: "Saldo ao retirar",
    warn:
      "Este cálculo é referencial. Ao fechar pelo WhatsApp o preço fica congelado para retirada (entre 24 e 72 h). O sinal opera como cláusula penal: se não retirar, fica em favor da Gamaex pelo prejuízo do estoque reservado.",
    ctaWhatsapp: "💬 Fechar pelo WhatsApp com a Gamaex →",
    ctaFinePrint:
      "Ao confirmar o preço pelo WhatsApp a Gamaex envia um link único onde você aceita as condições e paga o sinal pelo Mercado Pago. A operação é fechada com o pagamento.",
    howItWorksTitle: "Como funciona",
    step1: "Cote acima com a moeda e o valor que você precisa.",
    step2: "Feche pelo WhatsApp com a Gamaex (confirmamos preço e estoque).",
    step3: "Receba um link único com as condições fechadas e pague o sinal de 10% pelo Mercado Pago.",
    step4: "Retire entre 24 e 72 horas após o pagamento, em Av. Pedro de Valdivia 020, com documento.",
    whatsappMsg:
      "Olá, quero reservar uma operação na Gamaex.\n\n{op} {amount} {code}\nCotação referencial: {rate} por 1 {code}\nTotal estimado: {total}\nSinal 10%: {deposit}\n\nMe confirme o preço final e pago o sinal pelo Mercado Pago.",
  },
  voucher: {
    titlePaid: "Pronto! Sua operação está reservada",
    titlePending: "Sua reserva está pendente",
    subtitlePaid: "Guarde este comprovante ou tire um print. Você vai precisar na retirada.",
    subtitlePending:
      "Aguardando confirmação do pagamento. Esta página se atualiza sozinha quando chegar.",
    badgePaid: "✓ Reserva confirmada",
    badgePending: "Pagamento pendente",
    folio: "REF",
    operationHeader: "Operação",
    holderHeader: "Titular",
    pickupHeader: "Retirada",
    depositPaid: "Sinal pago",
    balanceOnPickup: "Saldo ao retirar",
    name: "Nome",
    rut: "RUT (ID)",
    email: "E-mail",
    whatsapp: "WhatsApp",
    address: "Endereço",
    hours: "Horário",
    pickupFrom: "Retirar a partir de",
    pickupBefore: "Retirar antes de",
    bring: "Traga",
    bringValue: "Documento + {balance} em CLP",
    ctaWhatsapp: "💬 Enviar comprovante pelo WhatsApp",
    ctaMaps: "Como chegar →",
    finePrint:
      "O sinal ({deposit}) opera como cláusula penal e é descontado do total na retirada. O preço ficou congelado com esta reserva. Se não retirar dentro da janela de 24 a 72 horas, a reserva expira automaticamente e o sinal fica em favor da Gamaex como indenização pelo prejuízo.",
    paymentFailedTitle: "O pagamento não foi concluído.",
    paymentFailedBody:
      "Sua reserva não foi confirmada. Você pode tentar novamente pela cotação.",
    ctaRetry: "Reservar de novo",
    notFoundTitle: "Não encontramos sua reserva.",
    notFoundBody:
      "Se acabou de pagar, aguarde alguns segundos e atualize. Se o problema persistir, envie mensagem no WhatsApp com seu número de referência.",
    ctaWA: "💬 Enviar mensagem no WhatsApp",
  },
  accept: {
    title: "Confirme sua reserva",
    subtitle:
      "Estas são as condições que fechamos pelo WhatsApp com {name}. Revise, aceite e pague o sinal para deixar a operação em firme.",
    alreadyPaidTitle: "Esta reserva já está paga.",
    alreadyPaidBody: "Você pode ver seu comprovante e dados de retirada.",
    ctaViewVoucher: "Ver meu comprovante →",
    expiredTitle: "Esta reserva não está mais vigente.",
    expiredBody: "Fale conosco pelo WhatsApp para montar uma nova.",
    invalidLinkTitle: "Este link não é válido ou expirou.",
    invalidLinkBody: "Fale conosco pelo WhatsApp para receber um novo link.",
    ctaBackQuote: "Voltar a cotar",
    operationHeader: "Operação",
    holderHeader: "Titular",
    conditionsHeader: "Condições",
    priceFrozen: "O preço fica congelado com esta reserva. É um fechamento de negócio.",
    pickupWindow:
      "Retire em Av. Pedro de Valdivia 020, Providencia, entre 24 e 72 horas após o pagamento, com documento.",
    penaltyClause:
      "O sinal não é reembolsável — opera como cláusula penal (Código Civil chileno art. 1535).",
    noShowClause:
      "Se não retirar dentro da janela ou mudar as condições fechadas, o sinal fica em favor da Gamaex como indenização pelo prejuízo de ter reservado estoque que deixou de ser vendido.",
    consent:
      "Li e aceito expressamente as condições desta reserva, incluindo a cláusula penal sobre o sinal. Ao pressionar \"Pagar sinal\" ficará registrada minha aceitação.",
    ctaAccept: "Aceito e pago {deposit} de sinal →",
    ctaAcceptSubmitting: "Redirecionando para o Mercado Pago…",
    ctaFinePrint:
      "Você será redirecionado ao Mercado Pago para pagar o sinal. Confirmado o pagamento, receberá seu comprovante com número de referência para a retirada.",
    error: "Não conseguimos processar sua aceitação. Tente novamente.",
    dataMismatchHelp: "Se algum dado não bater, avise a Gamaex pelo WhatsApp antes de aceitar.",
    holderName: "Nome",
    priceClosed: "Preço fechado",
    total: "Total da operação",
    depositNow: "Sinal a pagar agora (10%)",
    balancePickup: "Saldo ao retirar",
    paymentFailedInline: "O pagamento anterior não foi concluído. Você pode tentar de novo.",
  },
  common: {
    switchLanguage: "Mudar idioma",
  },
};

export const messages: Record<Locale, MessagesShape> = { es, en, pt };

/** Reemplaza {key} en un string por valores dinámicos. */
export function tpl(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
