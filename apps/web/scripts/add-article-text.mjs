import fs from "fs";
import path from "path";

const appDir = new URL("../src/app", import.meta.url).pathname;

const articles = {
  "casa-de-cambio-providencia": "Gamaex es la casa de cambio de referencia en Providencia desde 1987. Ubicada en Av. Pedro de Valdivia 020, a pasos de la salida del Metro Pedro de Valdivia (Línea 1), opera de lunes a viernes de 9:00 a 17:30 y sábados de 9:00 a 13:00. Con más de 38 años de trayectoria, Gamaex ofrece compra y venta de más de 40 monedas extranjeras al mejor precio, sin comisiones ocultas. El precio que ves es el precio final de la operación.",
  "casa-de-cambio-santiago": "Gamaex es la casa de cambio más reconocida de Santiago, con presencia en Providencia desde 1987. Su local en Av. Pedro de Valdivia 020 es referencia para residentes y empresas de toda la ciudad que buscan cambiar divisas con transparencia y sin comisiones. Más de 40 monedas disponibles, incluyendo dólar americano, euro, real brasileño, libra esterlina, yen japonés y peso argentino.",
  "comprar-dolares-providencia": "Comprar dólares en Providencia es fácil y conveniente en Gamaex. El local en Av. Pedro de Valdivia 020 ofrece el precio USD/CLP actualizado diariamente, sin comisiones ni cargos ocultos. Solo necesitas llevar tus pesos chilenos y recibirás dólares americanos al precio publicado. Para grandes montos, es recomendable consultar por WhatsApp antes de visitar el local.",
  "vender-dolares-providencia": "Para vender dólares en Providencia, Gamaex en Av. Pedro de Valdivia 020 ofrece la mejor cotización USD/CLP del sector. El proceso es directo: presentas tus billetes, se verifica su autenticidad y recibes pesos chilenos al precio del día. Sin comisiones, sin esperas. Para operaciones de mayor monto, consulta disponibilidad por WhatsApp antes de ir.",
  "precio-dolar-hoy-chile": "El precio del dólar hoy en Chile lo actualiza Gamaex diariamente en su local de Providencia. La cotización USD/CLP refleja las condiciones del mercado interbancario chileno y se publica tanto para compra como para venta. Gamaex opera sin comisiones adicionales: el precio publicado es el precio de la operación.",
  "tipo-de-cambio-hoy-chile": "Gamaex actualiza el tipo de cambio de más de 40 divisas todos los días hábiles. Los precios USD/CLP, EUR/CLP, BRL/CLP y demás cotizaciones se publican a apertura y pueden ajustarse durante la jornada según las condiciones del mercado. Para confirmar el precio antes de ir, escribe por WhatsApp con el monto que deseas operar.",
  "cotizacion-dolar-online": "La cotización del dólar online en Gamaex se actualiza diariamente. Puedes usar la calculadora de esta página para estimar cuántos pesos chilenos recibirías por tus dólares, o cuántos dólares obtendrías por una cantidad determinada de CLP. Recuerda que el valor es referencial — el precio final lo confirma un ejecutivo en el local.",
  "calculadora-divisas-chile": "La calculadora de divisas de Gamaex usa los precios reales del día para estimar el resultado de tu operación. Selecciona las monedas que deseas cambiar, ingresa el monto y verás el resultado aproximado. Para confirmar el precio y operar, consulta directamente por WhatsApp o visita el local en Av. Pedro de Valdivia 020, Providencia.",
  "casa-de-cambio-metro-pedro-de-valdivia": "El local de Gamaex se encuentra literalmente a pasos de la salida del Metro Pedro de Valdivia en Providencia. Desde la estación, camina menos de un minuto por Av. Pedro de Valdivia hacia el número 020. Es el punto de referencia para cientos de clientes que aprovechan el trayecto en metro para cambiar sus divisas antes o después del trabajo.",
  "casa-de-cambio-metro-los-leones": "La estación de Metro Los Leones (Línea 1) en Providencia está a corta distancia del local de Gamaex en Av. Pedro de Valdivia 020. Desde Los Leones, el recorrido a pie por Av. Pedro de Valdivia toma solo unos minutos. Ideal para quienes trabajan en la zona y necesitan cambiar dólares, euros o cualquier otra divisa durante el día.",
  "casa-de-cambio-las-condes": "Aunque Gamaex se ubica en Providencia, es la casa de cambio más accesible para residentes y trabajadores de Las Condes. Su local en Av. Pedro de Valdivia 020 está en el límite entre ambas comunas y es fácilmente accesible en metro (estación Pedro de Valdivia) o en vehículo particular. Sin comisiones y con más de 40 monedas disponibles.",
  "cambio-divisas-providencia": "Providencia concentra algunas de las mejores casas de cambio de Santiago, y Gamaex en Av. Pedro de Valdivia 020 es la referencia del sector. Con más de 38 años operando en el mismo local, es la opción elegida por quienes buscan transparencia, precios competitivos y atención directa sin intermediarios ni comisiones ocultas.",
  "cambio-de-moneda-santiago": "Cambiar moneda en Santiago es más conveniente que nunca con Gamaex en Providencia. Su ubicación central, a pasos del Metro Pedro de Valdivia (Línea 1), hace que el local sea accesible desde cualquier punto de la ciudad en pocos minutos. Más de 40 divisas disponibles, precios del día publicados y sin comisiones.",
  "precio-euro-hoy-chile": "El precio del euro hoy en Chile que publica Gamaex refleja la cotización EUR/CLP del mercado local. La tasa se actualiza diariamente y puede consultarse en esta página o directamente en el local de Providencia. Para operaciones en euros, se recomienda consultar disponibilidad por WhatsApp para montos superiores a 2.000 EUR.",
  "cuanto-vale-el-euro-en-chile": "El valor del euro en Chile varía diariamente según las condiciones del mercado cambiario internacional y local. Gamaex publica el precio EUR/CLP actualizado todos los días hábiles. La calculadora de esta página te permite estimar cuántos pesos chilenos recibirías por tus euros o cuántos euros obtendrías por una suma determinada en CLP.",
  "cuanto-esta-el-dolar-en-chile": "El dólar en Chile cotiza en base al tipo de cambio del mercado interbancario, publicado diariamente por el Banco Central de Chile. Gamaex actualiza su cotización USD/CLP para compra y venta todos los días hábiles. Usa la calculadora para estimar tu operación y confirma el precio exacto por WhatsApp antes de visitar el local.",
  "cambio-divisas-sin-comision": "El modelo de Gamaex es sencillo: publicamos un precio para compra y otro para venta, y esos son los precios definitivos de la operación. No hay comisiones separadas, no hay cargos por tipo de billete, no hay diferencia por el monto. Lo que ves en la pantalla es lo que pagas — un compromiso que mantenemos desde 1987.",
  "comprar-dolares-sin-comision": "En Gamaex, comprar dólares sin comisión es la norma, no la excepción. A diferencia de bancos y servicios online que aplican spreads abusivos, Gamaex opera con precios finales transparentes. El precio publicado en la pantalla es el precio de la operación. Sin cargos adicionales, sin letra pequeña.",
  "gamaex-chile-opiniones": "Gamaex acumula décadas de opiniones positivas de clientes en Providencia y toda el área metropolitana de Santiago. Los clientes destacan la transparencia en los precios, la rapidez del servicio y la confianza que genera atender en el mismo local desde 1987. Puedes revisar las reseñas directamente en Google Maps buscando 'Gamaex Providencia'.",
  "transferencias-internacionales-chile": "Gamaex ofrece el servicio de transferencias internacionales para personas y empresas en Chile que necesitan enviar o recibir fondos en moneda extranjera. El servicio incluye asesoría personalizada para cada operación, condiciones especiales para empresas con operaciones frecuentes y acompañamiento en el proceso de documentación requerido.",
  "money-exchange-santiago": "Gamaex is Santiago's most trusted currency exchange, operating since 1987 in Providencia. Located at Av. Pedro de Valdivia 020, steps from Metro Pedro de Valdivia (Line 1), Gamaex offers over 40 currencies with no hidden fees. Open Monday to Friday 9am–5:30pm and Saturday 9am–1pm.",
  "best-exchange-rate-santiago": "Getting the best exchange rate in Santiago means avoiding bank fees and airport kiosks. Gamaex in Providencia has been providing competitive USD/CLP, EUR/CLP and 40+ currency rates since 1987. No commissions, no hidden charges — the published rate is the final rate of the transaction.",
  "where-to-exchange-money-santiago": "The best place to exchange money in Santiago is Gamaex at Av. Pedro de Valdivia 020, Providencia — just steps from Metro Pedro de Valdivia (Line 1). Open weekdays 9am–5:30pm and Saturdays 9am–1pm. Bring cash and leave with 40+ currencies at competitive rates, zero fees.",
  "currency-exchange-near-me-santiago": "If you're looking for a currency exchange near you in Santiago, Gamaex at Av. Pedro de Valdivia 020, Providencia is accessible from the entire metropolitan area via Metro Line 1 (Pedro de Valdivia station). No appointment needed, no fees, 40+ currencies available on the spot.",
};

let updated = 0;
let skipped = 0;

for (const [slug, articleText] of Object.entries(articles)) {
  const filePath = path.join(appDir, slug, "page.tsx");
  if (!fs.existsSync(filePath)) { console.log(`SKIP (not found): ${slug}`); skipped++; continue; }
  let content = fs.readFileSync(filePath, "utf-8");
  if (content.includes("articleText")) { console.log(`SKIP (already has): ${slug}`); skipped++; continue; }

  // Replace pageContext={{ ... }} /> with pageContext={{ ..., articleText: "..." }} />
  // Find the LandingPage line and add articleText before the closing }}
  const escaped = articleText.replace(/"/g, '\\"');
  const updated_content = content.replace(
    /pageContext=\{\{([^}]+)\}\}\s*\/>/,
    (match, inner) => `pageContext={{ ${inner.trim()}, articleText: "${escaped}" }} />`
  );

  if (updated_content === content) {
    console.log(`FAIL (no pageContext found): ${slug}`);
    skipped++;
    continue;
  }
  fs.writeFileSync(filePath, updated_content, "utf-8");
  console.log(`UPDATED: ${slug}`);
  updated++;
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
