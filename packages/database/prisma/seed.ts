import { PrismaClient, QuoteMode } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

const CURRENCIES = [
  { code: "USD", name: "Dólar USA",          flag_emoji: "🇺🇸", display_order: 1 },
  { code: "EUR", name: "Euro",               flag_emoji: "🇪🇺", display_order: 2 },
  { code: "BRL", name: "Real Brasileño",     flag_emoji: "🇧🇷", display_order: 3 },
  { code: "GBP", name: "Libra Esterlina",    flag_emoji: "🇬🇧", display_order: 4 },
  { code: "ARS", name: "Peso Argentino",     flag_emoji: "🇦🇷", display_order: 5 },
  { code: "CHF", name: "Franco Suizo",       flag_emoji: "🇨🇭", display_order: 6 },
  { code: "CAD", name: "Dólar Canadiense",   flag_emoji: "🇨🇦", display_order: 7 },
  { code: "MXN", name: "Peso Mexicano",      flag_emoji: "🇲🇽", display_order: 8 },
  { code: "JPY", name: "Yen Japonés",        flag_emoji: "🇯🇵", display_order: 9,  decimal_places: 0 },
  { code: "UYU", name: "Peso Uruguayo",      flag_emoji: "🇺🇾", display_order: 10 },
  { code: "PEN", name: "Sol Peruano",        flag_emoji: "🇵🇪", display_order: 11 },
  { code: "AUD", name: "Dólar Australiano",  flag_emoji: "🇦🇺", display_order: 12 },
];

// Márgenes iniciales — ajustar según política real de Gamaex
const DEFAULT_MARGINS: Record<string, { buy: number; sell: number }> = {
  USD: { buy: -5,  sell: 8  },
  EUR: { buy: -8,  sell: 12 },
  BRL: { buy: -2,  sell: 4  },
  GBP: { buy: -10, sell: 15 },
  ARS: { buy: -1,  sell: 2  },
  CHF: { buy: -8,  sell: 12 },
  CAD: { buy: -5,  sell: 8  },
  MXN: { buy: -1,  sell: 2  },
  JPY: { buy: -1,  sell: 1  },
  UYU: { buy: -1,  sell: 2  },
  PEN: { buy: -3,  sell: 5  },
  AUD: { buy: -5,  sell: 8  },
};

async function main() {
  console.log("🌱 Seeding database...");

  // Monedas + configuración inicial
  for (const currency of CURRENCIES) {
    const margins = DEFAULT_MARGINS[currency.code] ?? { buy: 0, sell: 0 };

    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: {
        code:          currency.code,
        name:          currency.name,
        flag_emoji:    currency.flag_emoji,
        decimal_places: currency.decimal_places ?? 2,
        display_order: currency.display_order,
        is_active:     true,
        quote_config: {
          create: {
            mode:        QuoteMode.AUTO,
            buy_margin:  margins.buy,
            sell_margin: margins.sell,
          },
        },
      },
    });

    console.log(`  ✓ ${currency.code} — ${currency.name}`);
  }

  // SystemConfig — valores por defecto
  const systemDefaults = [
    { key: "sync_interval_seconds",        value: "300",  description: "Cada cuántos segundos se sincroniza con ExchangeRatesAPI" },
    { key: "price_alert_delta_pct",        value: "15",   description: "% de variación máxima aceptable respecto al último snapshot antes de emitir alerta" },
    { key: "max_cron_failures_before_alert", value: "3",  description: "Cuántos fallos consecutivos del cron antes de notificar al admin" },
    { key: "public_cache_ttl_seconds",     value: "60",   description: "TTL del cache Redis para el endpoint público de tasas" },
    { key: "whatsapp_confirmation_required", value: "false", description: "Si es true, los comandos WA requieren confirmación con OK antes de aplicar" },
  ];

  for (const config of systemDefaults) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  console.log("  ✓ SystemConfig por defecto");

  // Placeholder desactivado — el acceso real se configura con el script add-admins.ts
  const { hash } = await import("bcrypt");
  const placeholderHash = await hash("__seed_placeholder_disabled__", 12);

  await prisma.adminUser.upsert({
    where: { email: "admin@gamaex.cl" },
    update: { is_active: false },
    create: {
      email:         "admin@gamaex.cl",
      password_hash: placeholderHash,
      name:          "Placeholder",
      role:          "SUPER_ADMIN",
      is_active:     false,
    },
  });

  console.log("  ✓ admin@gamaex.cl creado/desactivado (placeholder — no usar)");

  console.log("\n✅ Seed completado");
}

main()
  .catch((e) => {
    console.error("❌ Seed falló:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
