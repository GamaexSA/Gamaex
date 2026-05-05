/**
 * Script idempotente para agregar Oro (ORO) a la BD.
 *
 * Modo MANUAL con compra/venta inicial = 100. Ajustable luego desde el admin.
 *
 * Uso:
 *   pnpm --filter @gamaex/database db:add-oro
 */

import { PrismaClient, QuoteMode } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🪙 Agregando Oro (ORO)...");

  const initialPrice = 100;

  const currency = await prisma.currency.upsert({
    where: { code: "ORO" },
    update: { is_active: true },
    create: {
      code:           "ORO",
      name:           "Oro",
      flag_emoji:     "🪙",
      decimal_places: 0,
      display_order:  14,
      is_active:      true,
      quote_config: {
        create: {
          mode:         QuoteMode.MANUAL,
          buy_margin:   0,
          sell_margin:  0,
          manual_buy:   initialPrice,
          manual_sell:  initialPrice,
          current_buy:  initialPrice,
          current_sell: initialPrice,
          last_synced_at: new Date(),
          last_synced_by: "seed:add-oro",
        },
      },
    },
    include: { quote_config: true },
  });

  // Si ya existía, asegurar que tenga quote_config con valores
  if (!currency.quote_config) {
    await prisma.quoteConfig.create({
      data: {
        currency_id:  currency.id,
        mode:         QuoteMode.MANUAL,
        manual_buy:   initialPrice,
        manual_sell:  initialPrice,
        current_buy:  initialPrice,
        current_sell: initialPrice,
        last_synced_at: new Date(),
        last_synced_by: "seed:add-oro",
      },
    });
  }

  console.log(`  ✓ ${currency.code} — ${currency.name} (id: ${currency.id})`);
  console.log(`  ✓ Modo MANUAL · Compra: ${initialPrice} · Venta: ${initialPrice}`);
  console.log(`\n✅ Listo. Ajustá los precios desde el admin → Currencies.`);
}

main()
  .catch((e) => {
    console.error("❌ Falló:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
