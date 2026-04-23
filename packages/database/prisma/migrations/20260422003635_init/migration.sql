-- CreateEnum
CREATE TYPE "QuoteMode" AS ENUM ('AUTO', 'MANUAL');

-- CreateEnum
CREATE TYPE "SnapshotSource" AS ENUM ('CRON_AUTO', 'ADMIN_PANEL', 'WHATSAPP_CMD', 'API_FORCE_SYNC');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('UPDATE_MARGINS', 'SET_MANUAL_PRICES', 'SWITCH_TO_AUTO', 'SWITCH_TO_MANUAL', 'FORCE_SYNC', 'CREATE_CURRENCY', 'UPDATE_CURRENCY', 'TOGGLE_CURRENCY_ACTIVE', 'UPDATE_DISPLAY_ORDER', 'CREATE_ADMIN_USER', 'UPDATE_ADMIN_USER', 'DEACTIVATE_ADMIN_USER', 'RESET_ADMIN_PASSWORD', 'ADD_WA_NUMBER', 'REMOVE_WA_NUMBER', 'TOGGLE_WA_NUMBER', 'CREATE_API_KEY', 'REVOKE_API_KEY');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'OPERATOR');

-- CreateEnum
CREATE TYPE "ApiKeyScope" AS ENUM ('READ_ONLY', 'WEBHOOK');

-- CreateTable
CREATE TABLE "currencies" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flag_emoji" TEXT NOT NULL,
    "decimal_places" INTEGER NOT NULL DEFAULT 2,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_configs" (
    "id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "mode" "QuoteMode" NOT NULL DEFAULT 'AUTO',
    "buy_margin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sell_margin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "manual_buy" DOUBLE PRECISION,
    "manual_sell" DOUBLE PRECISION,
    "current_buy" DOUBLE PRECISION,
    "current_sell" DOUBLE PRECISION,
    "last_base_price" DOUBLE PRECISION,
    "last_synced_at" TIMESTAMP(3),
    "last_synced_by" TEXT,
    "price_alert_active" BOOLEAN NOT NULL DEFAULT false,
    "price_alert_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_snapshots" (
    "id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "base_price" DOUBLE PRECISION NOT NULL,
    "buy_price" DOUBLE PRECISION NOT NULL,
    "sell_price" DOUBLE PRECISION NOT NULL,
    "buy_margin" DOUBLE PRECISION NOT NULL,
    "sell_margin" DOUBLE PRECISION NOT NULL,
    "mode" "QuoteMode" NOT NULL,
    "source" "SnapshotSource" NOT NULL,
    "source_meta" TEXT,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actor_id" TEXT,
    "actor_ref" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'OPERATOR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_allowed_numbers" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_allowed_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "scope" "ApiKeyScope" NOT NULL DEFAULT 'READ_ONLY',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "quote_configs_currency_id_key" ON "quote_configs"("currency_id");

-- CreateIndex
CREATE INDEX "quote_snapshots_currency_id_captured_at_idx" ON "quote_snapshots"("currency_id", "captured_at");

-- CreateIndex
CREATE INDEX "quote_snapshots_captured_at_idx" ON "quote_snapshots"("captured_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_id_created_at_idx" ON "audit_logs"("entity_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_actor_ref_created_at_idx" ON "audit_logs"("actor_ref", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_allowed_numbers_phone_key" ON "whatsapp_allowed_numbers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "api_keys"("key_hash");

-- AddForeignKey
ALTER TABLE "quote_configs" ADD CONSTRAINT "quote_configs_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_snapshots" ADD CONSTRAINT "quote_snapshots_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
