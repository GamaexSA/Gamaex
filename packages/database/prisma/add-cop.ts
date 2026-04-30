/**
 * Script idempotente para agregar el Peso Colombiano (COP) a la BD.
 *
 * Se conecta a la DATABASE_URL configurada y hace upsert de la moneda
 * + su quote_config inicial. Si COP ya existe, no hace nada.
 *
 * Uso:
 *   pnpm --filter @gamaex/database db:add-cop
 *
 * Para ejecutar contra producción, asegurar que DATABASE_URL apunte a la
 * BD productiva antes de correr el comando (ya sea por .env o exportada).
 */

import { PrismaClient, QuoteMode } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🇨🇴 Agregando Peso Colombiano (COP)...");

  const result = await prisma.currency.upsert({
    where: { code: "COP" },
    update: {
      // Si ya existe, no sobreescribimos nada — sólo aseguramos is_active
      is_active: true,
    },
    create: {
      code:           "COP",
      name:           "Peso Colombiano",
      flag_emoji:     "🇨🇴",
      decimal_places: 2,
      display_order:  13,
      is_active:      true,
      quote_config: {
        create: {
          mode:        QuoteMode.MANUAL,
          buy_margin:  -1,
          sell_margin: 2,
        },
      },
    },
    include: { quote_config: true },
  });

  console.log(`  ✓ ${result.code} — ${result.name} (id: ${result.id})`);
  console.log(`  ✓ Modo inicial: MANUAL · Margen compra: -1 · Margen venta: 2`);
  console.log(`\n✅ Listo. Entrá al admin → Currencies y configurá el precio manual de COP.`);
}

main()
  .catch((e) => {
    console.error("❌ Falló:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
