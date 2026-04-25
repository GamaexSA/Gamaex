import fs from "fs";
import path from "path";

const appDir = new URL("../src/app", import.meta.url).pathname;

const contexts = {
  "calculadora-divisas-chile": {
    h1Before: "Calculadora de ",
    h1Accent: "divisas en Chile",
    heroDesc: "Calcula el cambio de cualquier moneda con los precios del día en Gamaex. USD, EUR, BRL y +40 divisas. Sin comisiones, precios reales en Providencia.",
  },
  "cambiar-dolares-a-pesos-chilenos": {
    h1Before: "Cambiar dólares a ",
    h1Accent: "pesos chilenos",
    heroDesc: "Cambia tus dólares a pesos chilenos al mejor precio. Gamaex en Providencia — cotización USD/CLP actualizada, sin comisiones, pago inmediato.",
  },
  "best-exchange-rate-santiago": {
    h1Before: "Best currency exchange in ",
    h1Accent: "Santiago",
    heroDesc: "Get the best USD, EUR and 40+ currency exchange rates in Santiago at Gamaex, Providencia. No fees, live rates, 38 years of experience.",
  },
  "cambiar-dolares-providencia": {
    h1Before: "Cambiar dólares en ",
    h1Accent: "Providencia",
    heroDesc: "Cambia tus dólares en Providencia al mejor precio. Gamaex en Av. Pedro de Valdivia 020 — sin comisiones, cotización diaria, atención directa.",
  },
  "cambiar-euros-santiago": {
    h1Before: "Cambiar euros en ",
    h1Accent: "Santiago",
    heroDesc: "Cambia euros en Santiago al mejor precio. Gamaex en Providencia — cotización EUR/CLP actualizada diariamente, sin comisiones.",
  },
  "cambiar-reales-a-pesos-chilenos": {
    h1Before: "Cambiar reales a ",
    h1Accent: "pesos chilenos",
    heroDesc: "Cambia reales brasileños a pesos chilenos en Gamaex, Providencia. Cotización BRL/CLP actualizada, sin comisiones, atención directa.",
  },
  "cambiar-reales-santiago": {
    h1Before: "Cambiar reales en ",
    h1Accent: "Santiago",
    heroDesc: "Cambia reales brasileños en Santiago al mejor precio. Gamaex en Providencia — cotización BRL/CLP diaria, sin comisiones.",
  },
  "cambio-de-dolares-hoy-santiago": {
    h1Before: "Cambio de dólares hoy en ",
    h1Accent: "Santiago",
    heroDesc: "Precio del dólar actualizado hoy en Santiago. Cambia USD en Gamaex, Providencia — sin comisiones, atención directa.",
  },
  "cambio-de-moneda-santiago": {
    h1Before: "Cambio de moneda en ",
    h1Accent: "Santiago",
    heroDesc: "Cambio de moneda en Santiago con más de 40 divisas. Gamaex en Providencia — precios del día, sin comisiones, 38 años de trayectoria.",
  },
  "cambio-divisas-las-condes": {
    h1Before: "Cambio de divisas · ",
    h1Accent: "Las Condes",
    heroDesc: "Cambio de divisas cercano a Las Condes. Gamaex en Av. Pedro de Valdivia 020, Providencia — USD, EUR y +40 monedas sin comisiones.",
  },
  "cambio-divisas-providencia": {
    h1Before: "Cambio de divisas en ",
    h1Accent: "Providencia",
    heroDesc: "Cambio de divisas en Providencia con más de 40 monedas. Gamaex en Av. Pedro de Valdivia 020 — precios transparentes, sin comisiones.",
  },
  "cambio-divisas-santiago-centro": {
    h1Before: "Cambio de divisas en ",
    h1Accent: "Santiago",
    heroDesc: "Cambio de divisas en Santiago con más de 40 monedas. Gamaex en Providencia — la referencia de casas de cambio en la ciudad.",
  },
  "cambio-divisas-sin-comision": {
    h1Before: "Cambio de divisas ",
    h1Accent: "sin comisión",
    heroDesc: "Cambia divisas sin comisiones en Gamaex, Providencia. El precio que ves es el precio final — sin cargos ocultos, sin sorpresas.",
  },
  "cambio-dolar-canadiense-chile": {
    h1Before: "Cambio dólar ",
    h1Accent: "canadiense en Chile",
    heroDesc: "Compra y venta de dólar canadiense (CAD) en Gamaex, Providencia. Cotización CAD/CLP actualizada, sin comisiones, atención directa.",
  },
  "cambio-dolar-euro-santiago": {
    h1Before: "Cambio dólar y euro en ",
    h1Accent: "Santiago",
    heroDesc: "USD/CLP y EUR/CLP actualizados en Gamaex, Providencia. Compra y venta de dólares y euros en Santiago sin comisiones.",
  },
  "cambio-dolar-hoy-chile": {
    h1Before: "Cambio de dólar ",
    h1Accent: "hoy en Chile",
    heroDesc: "Cotización del dólar actualizada hoy en Chile. Cambia USD en Gamaex, Providencia — sin comisiones, mejor precio garantizado.",
  },
  "cambio-euro-chile": {
    h1Before: "Cambio de euro en ",
    h1Accent: "Chile",
    heroDesc: "Compra y venta de euros en Chile al mejor precio. Gamaex en Providencia — cotización EUR/CLP actualizada, sin comisiones.",
  },
  "cambio-franco-suizo-chile": {
    h1Before: "Cambio franco ",
    h1Accent: "suizo en Chile",
    heroDesc: "Compra y venta de franco suizo (CHF) en Gamaex, Providencia. Cotización CHF/CLP actualizada, sin comisiones, atención directa.",
  },
  "cambio-corona-noruega-chile": {
    h1Before: "Cambio corona ",
    h1Accent: "noruega en Chile",
    heroDesc: "Compra y venta de corona noruega (NOK) en Gamaex, Providencia. Cotización NOK/CLP actualizada, sin comisiones.",
  },
  "cambio-moneda-extranjera-chile": {
    h1Before: "Cambio de moneda ",
    h1Accent: "extranjera en Chile",
    heroDesc: "Más de 40 monedas extranjeras en Gamaex, Providencia. USD, EUR, GBP, BRL, JPY y más — sin comisiones, 38 años de experiencia.",
  },
  "cambio-libra-esterlina-chile": {
    h1Before: "Cambio libra ",
    h1Accent: "esterlina en Chile",
    heroDesc: "Compra y venta de libras esterlinas (GBP) en Gamaex, Providencia. Cotización GBP/CLP actualizada, sin comisiones, atención directa.",
  },
  "cambio-moneda-viaje-chile": {
    h1Before: "Divisas para tu ",
    h1Accent: "viaje desde Chile",
    heroDesc: "Prepara las divisas para tu próximo viaje en Gamaex, Providencia. USD, EUR, BRL y +40 monedas al mejor precio, sin comisiones.",
  },
  "cambio-real-brasileno-hoy": {
    h1Before: "Cambio real brasileño ",
    h1Accent: "hoy en Chile",
    heroDesc: "Cotización del real brasileño actualizada hoy. Cambia BRL en Gamaex, Providencia — sin comisiones, precio justo BRL/CLP.",
  },
  "cambio-peso-argentino-chile": {
    h1Before: "Cambio peso ",
    h1Accent: "argentino en Chile",
    heroDesc: "Compra y venta de pesos argentinos (ARS) en Gamaex, Providencia. Cotización ARS/CLP actualizada, sin comisiones.",
  },
  "cambio-sol-peruano-chile": {
    h1Before: "Cambio sol ",
    h1Accent: "peruano en Chile",
    heroDesc: "Compra y venta de soles peruanos (PEN) en Gamaex, Providencia. Cotización PEN/CLP actualizada, sin comisiones.",
  },
  "cambio-yuan-chino-chile": {
    h1Before: "Cambio yuan ",
    h1Accent: "chino en Chile",
    heroDesc: "Compra y venta de yuan chino (CNY) en Gamaex, Providencia. Cotización CNY/CLP actualizada, sin comisiones.",
  },
  "cambio-yen-japones-chile": {
    h1Before: "Cambio yen ",
    h1Accent: "japonés en Chile",
    heroDesc: "Compra y venta de yen japonés (JPY) en Gamaex, Providencia. Cotización JPY/CLP actualizada, sin comisiones.",
  },
  "casa-de-cambio-barrio-italia": {
    h1Before: "Casa de cambio · ",
    h1Accent: "Barrio Italia",
    heroDesc: "Casa de cambio cercana al Barrio Italia. Gamaex en Av. Pedro de Valdivia 020, Providencia — a minutos de Italia. Sin comisiones, 38 años.",
  },
  "cambio-dolar-australiano-chile": {
    h1Before: "Cambio dólar ",
    h1Accent: "australiano en Chile",
    heroDesc: "Compra y venta de dólar australiano (AUD) en Gamaex, Providencia. Cotización AUD/CLP actualizada, sin comisiones.",
  },
  "casa-de-cambio-las-condes": {
    h1Before: "Casa de cambio · ",
    h1Accent: "Las Condes",
    heroDesc: "Casa de cambio cercana a Las Condes. Gamaex en Av. Pedro de Valdivia 020, Providencia — USD, EUR y +40 divisas sin comisiones.",
  },
  "casa-de-cambio-metro-baquedano": {
    h1Before: "Casa de cambio · Metro ",
    h1Accent: "Baquedano",
    heroDesc: "Casa de cambio cerca del Metro Baquedano. Gamaex en Av. Pedro de Valdivia 020, Providencia — divisas sin comisiones, 38 años.",
  },
  "casa-de-cambio-costanera-center": {
    h1Before: "Casa de cambio · ",
    h1Accent: "Costanera Center",
    heroDesc: "Casa de cambio cercana a Costanera Center. Gamaex en Av. Pedro de Valdivia 020, Providencia — +40 divisas, sin comisiones.",
  },
  "casa-de-cambio-metro-pedro-de-valdivia": {
    h1Before: "Casa de cambio · Metro ",
    h1Accent: "Pedro de Valdivia",
    heroDesc: "A pasos de la salida del Metro Pedro de Valdivia. Gamaex en Av. Pedro de Valdivia 020, Providencia — divisas sin comisiones.",
  },
  "cambio-dolar-peso-chileno": {
    h1Before: "Cambio dólar a ",
    h1Accent: "peso chileno",
    heroDesc: "Cotización USD/CLP actualizada en Gamaex, Providencia. Compra y venta de dólares a pesos chilenos sin comisiones, atención directa.",
  },
  "casa-de-cambio-metro-santa-isabel": {
    h1Before: "Casa de cambio · Metro ",
    h1Accent: "Santa Isabel",
    heroDesc: "Casa de cambio cerca del Metro Santa Isabel. Gamaex en Av. Pedro de Valdivia 020, Providencia — divisas sin comisiones.",
  },
  "casa-de-cambio-miraflores": {
    h1Before: "Casa de cambio · ",
    h1Accent: "Miraflores",
    heroDesc: "Casa de cambio cerca de Miraflores. Gamaex en Av. Pedro de Valdivia 020, Providencia — +40 divisas, sin comisiones, 38 años.",
  },
  "casa-de-cambio-providencia": {
    h1Before: "La mejor casa de cambio en ",
    h1Accent: "Providencia",
    heroDesc: "Gamaex en Av. Pedro de Valdivia 020 — referencia en cambio de divisas en Providencia por más de 38 años. Sin comisiones.",
  },
  "casa-de-cambio-nunoa": {
    h1Before: "Casa de cambio cercana a ",
    h1Accent: "Ñuñoa",
    heroDesc: "Casa de cambio a minutos de Ñuñoa. Gamaex en Av. Pedro de Valdivia 020, Providencia — USD, EUR y +40 divisas sin comisiones.",
  },
  "cambio-peso-colombiano-chile": {
    h1Before: "Cambio peso ",
    h1Accent: "colombiano en Chile",
    heroDesc: "Compra y venta de pesos colombianos (COP) en Gamaex, Providencia. Cotización COP/CLP actualizada, sin comisiones.",
  },
  "comprar-dolares-chile": {
    h1Before: "Comprar dólares en ",
    h1Accent: "Chile",
    heroDesc: "Compra dólares en Chile al mejor precio. Gamaex en Providencia — cotización USD/CLP actualizada, sin comisiones, atención directa.",
  },
  "comprar-dolares-santiago": {
    h1Before: "Comprar dólares en ",
    h1Accent: "Santiago",
    heroDesc: "El mejor lugar para comprar dólares en Santiago. Gamaex en Providencia — cotización USD/CLP actualizada, sin comisiones.",
  },
  "comprar-euros-santiago": {
    h1Before: "Comprar euros en ",
    h1Accent: "Santiago",
    heroDesc: "Compra euros en Santiago al mejor precio. Gamaex en Providencia — cotización EUR/CLP actualizada, sin comisiones.",
  },
  "conversor-divisas-chile": {
    h1Before: "Conversor de ",
    h1Accent: "divisas en Chile",
    heroDesc: "Convierte cualquier moneda con los precios reales de Gamaex. USD, EUR, BRL y +40 divisas. Calcula y cotiza directamente por WhatsApp.",
  },
  "cotizacion-dolar-chile-hoy": {
    h1Before: "Cotización dólar ",
    h1Accent: "Chile hoy",
    heroDesc: "Cotización del dólar en Chile actualizada hoy. Consulta el USD/CLP y cambia tus divisas en Gamaex Providencia sin comisiones.",
  },
  "cotizacion-dolar-online": {
    h1Before: "Cotización dólar ",
    h1Accent: "online",
    heroDesc: "Consulta la cotización del dólar online en Gamaex. Precio USD/CLP actualizado diariamente — cambia en Providencia sin comisiones.",
  },
  "cotizacion-euro-online": {
    h1Before: "Cotización euro ",
    h1Accent: "online",
    heroDesc: "Consulta la cotización del euro online en Gamaex. Precio EUR/CLP actualizado diariamente — cambia en Providencia sin comisiones.",
  },
  "cuanto-esta-el-dolar-en-chile": {
    h1Before: "¿Cuánto está el ",
    h1Accent: "dólar en Chile?",
    heroDesc: "Cotización del dólar en Chile actualizada hoy. Consulta el USD/CLP en Gamaex y cambia tus divisas en Providencia sin comisiones.",
  },
  "cuanto-vale-el-euro-en-chile": {
    h1Before: "¿Cuánto vale el ",
    h1Accent: "euro en Chile?",
    heroDesc: "Cotización del euro en Chile actualizada hoy. Consulta el EUR/CLP en Gamaex y cambia tus euros en Providencia sin comisiones.",
  },
  "currency-exchange-near-me-santiago": {
    h1Before: "Currency exchange ",
    h1Accent: "near you · Santiago",
    heroDesc: "The closest currency exchange in Santiago to you. Gamaex at Av. Pedro de Valdivia 020, Providencia — no fees, 40+ currencies.",
  },
  "efectivo-en-moneda-extranjera-chile": {
    h1Before: "Efectivo en ",
    h1Accent: "moneda extranjera",
    heroDesc: "Obtén efectivo en moneda extranjera en Chile. Gamaex en Providencia entrega USD, EUR, GBP y +40 divisas en efectivo, sin comisiones.",
  },
  "exchange-rate-chile-today": {
    h1Before: "Live exchange rate ",
    h1Accent: "Chile today",
    heroDesc: "Live USD/CLP, EUR/CLP and 40+ currency rates at Gamaex, Providencia. No fees, walk-in service, 38 years of experience.",
  },
  "gamaex-chile-opiniones": {
    h1Before: "Opiniones sobre ",
    h1Accent: "Gamaex Chile",
    heroDesc: "Clientes reales opinan sobre Gamaex, la casa de cambio de referencia en Providencia. 38 años al servicio de personas y empresas.",
  },
  "mejor-tipo-de-cambio-santiago": {
    h1Before: "El mejor tipo de ",
    h1Accent: "cambio en Santiago",
    heroDesc: "Gamaex ofrece el mejor tipo de cambio en Santiago. Sin comisiones, precios actualizados y 38 años de trayectoria en Providencia.",
  },
  "money-exchange-santiago": {
    h1Before: "Money exchange in ",
    h1Accent: "Santiago",
    heroDesc: "The best money exchange in Santiago. Gamaex at Av. Pedro de Valdivia 020, Providencia — 40+ currencies, no fees, 38 years of experience.",
  },
  "pago-proveedores-moneda-extranjera": {
    h1Before: "Pago a proveedores en ",
    h1Accent: "moneda extranjera",
    heroDesc: "Paga a tus proveedores en moneda extranjera con Gamaex. Condiciones especiales para empresas, transferencias internacionales y divisas.",
  },
  "precio-dolar-hoy-chile": {
    h1Before: "Precio del dólar ",
    h1Accent: "hoy en Chile",
    heroDesc: "Consulta el precio del dólar hoy en Chile. Gamaex actualiza el USD/CLP diariamente. Cambia en Providencia sin comisiones.",
  },
  "precio-dolar-hoy-providencia": {
    h1Before: "Precio del dólar hoy en ",
    h1Accent: "Providencia",
    heroDesc: "Precio del dólar actualizado hoy en Providencia. Gamaex en Av. Pedro de Valdivia 020 — cotización USD/CLP en tiempo real.",
  },
  "precio-dolar-santiago-hoy": {
    h1Before: "Precio dólar hoy en ",
    h1Accent: "Santiago",
    heroDesc: "Precio del dólar en Santiago actualizado hoy. Consulta el USD/CLP y cambia tus divisas en Gamaex Providencia sin comisiones.",
  },
  "precio-euro-hoy-chile": {
    h1Before: "Precio del euro ",
    h1Accent: "hoy en Chile",
    heroDesc: "Consulta el precio del euro hoy en Chile. Gamaex actualiza el EUR/CLP diariamente. Cambia en Providencia sin comisiones.",
  },
  "precio-euro-hoy-santiago": {
    h1Before: "Precio del euro hoy en ",
    h1Accent: "Santiago",
    heroDesc: "Precio del euro en Santiago actualizado hoy. Consulta el EUR/CLP y cambia tus divisas en Gamaex Providencia sin comisiones.",
  },
  "tipo-de-cambio-euro-chile": {
    h1Before: "Tipo de cambio del ",
    h1Accent: "euro en Chile",
    heroDesc: "Tipo de cambio EUR/CLP actualizado hoy en Chile. Cambia tus euros en Gamaex Providencia sin comisiones.",
  },
  "tipo-de-cambio-hoy-chile": {
    h1Before: "Tipo de cambio ",
    h1Accent: "hoy en Chile",
    heroDesc: "Tipos de cambio actualizados hoy en Chile. USD, EUR, BRL y +40 divisas en Gamaex Providencia — sin comisiones.",
  },
  "tipo-de-cambio-dolar-hoy-chile": {
    h1Before: "Tipo de cambio dólar ",
    h1Accent: "hoy en Chile",
    heroDesc: "Tipo de cambio del dólar actualizado hoy en Chile. Cotización USD/CLP en Gamaex Providencia — sin comisiones.",
  },
  "transferencias-internacionales-chile": {
    h1Before: "Transferencias ",
    h1Accent: "internacionales Chile",
    heroDesc: "Envío y recepción de fondos al exterior desde Chile. Gamaex en Providencia — asesoría personalizada, condiciones especiales para empresas.",
  },
  "vender-dolares-chile": {
    h1Before: "Vender dólares en ",
    h1Accent: "Chile",
    heroDesc: "Vende tus dólares en Chile al mejor precio. Gamaex en Providencia — pago inmediato, sin comisiones, cotización USD/CLP justa.",
  },
  "vender-dolares-santiago": {
    h1Before: "Vender dólares en ",
    h1Accent: "Santiago",
    heroDesc: "El mejor lugar para vender dólares en Santiago. Gamaex en Providencia — pago inmediato, sin comisiones.",
  },
  "vender-euros-santiago": {
    h1Before: "Vender euros en ",
    h1Accent: "Santiago",
    heroDesc: "Vende tus euros en Santiago al mejor precio. Gamaex en Providencia — pago inmediato, sin comisiones, cotización EUR/CLP justa.",
  },
  "where-to-exchange-money-santiago": {
    h1Before: "Where to exchange ",
    h1Accent: "money in Santiago",
    heroDesc: "The best place to exchange money in Santiago. Gamaex at Av. Pedro de Valdivia 020, Providencia — no fees, 40+ currencies, 38 years.",
  },
  "cambio-dolar-peso-chileno": {
    h1Before: "Cambio dólar · ",
    h1Accent: "peso chileno",
    heroDesc: "Cotización USD/CLP actualizada en Gamaex, Providencia. Compra y venta de dólares a pesos chilenos sin comisiones.",
  },
  "casa-de-cambio-santiago": {
    h1Before: "La casa de cambio de ",
    h1Accent: "Santiago",
    heroDesc: "Gamaex, la referencia en cambio de divisas en Santiago. En Providencia desde hace 38 años — USD, EUR y +40 monedas sin comisiones.",
  },
  "casa-de-cambio-vitacura": {
    h1Before: "Casa de cambio cercana a ",
    h1Accent: "Vitacura",
    heroDesc: "Casa de cambio cerca de Vitacura. Gamaex en Av. Pedro de Valdivia 020, Providencia — divisas sin comisiones, 38 años de trayectoria.",
  },
  "cambio-real-brasileno-hoy": {
    h1Before: "Cambio real brasileño ",
    h1Accent: "hoy Chile",
    heroDesc: "Cotización BRL/CLP actualizada hoy. Cambia reales brasileños en Gamaex Providencia sin comisiones.",
  },
  "cambio-libra-esterlina-chile": {
    h1Before: "Cambio libra esterlina ",
    h1Accent: "en Chile",
    heroDesc: "Compra y venta de libras esterlinas (GBP) en Gamaex, Providencia. Cotización GBP/CLP actualizada, sin comisiones.",
  },
};

let updated = 0;
let skipped = 0;

for (const [slug, ctx] of Object.entries(contexts)) {
  const filePath = path.join(appDir, slug, "page.tsx");
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${slug}`);
    skipped++;
    continue;
  }
  let content = fs.readFileSync(filePath, "utf-8");
  if (content.includes("pageContext")) {
    console.log(`SKIP (already has pageContext): ${slug}`);
    skipped++;
    continue;
  }
  const target = `<LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} />`;
  if (!content.includes(target)) {
    console.log(`SKIP (pattern not found): ${slug}`);
    skipped++;
    continue;
  }
  const h1Before = ctx.h1Before.replace(/"/g, '\\"');
  const h1Accent = ctx.h1Accent.replace(/"/g, '\\"');
  const heroDesc = ctx.heroDesc.replace(/"/g, '\\"');
  const replacement = `<LandingPage rates={data.rates} systemStatus={data.system_status} lastSyncAt={data.last_sync_at} pageContext={{ h1Before: "${h1Before}", h1Accent: "${h1Accent}", heroDesc: "${heroDesc}" }} />`;
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`UPDATED: ${slug}`);
  updated++;
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
