-- CreateEnum
CREATE TYPE "PriceAlertStatus" AS ENUM ('PENDING', 'CONTACTED', 'CLOSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PriceAlertOperation" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "price_alerts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "currency_code" TEXT NOT NULL,
    "operation" "PriceAlertOperation" NOT NULL,
    "target_price" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION,
    "comment" TEXT,
    "price_buy_ref" DOUBLE PRECISION,
    "price_sell_ref" DOUBLE PRECISION,
    "status" "PriceAlertStatus" NOT NULL DEFAULT 'PENDING',
    "status_note" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "price_alerts_status_currency_code_idx" ON "price_alerts"("status", "currency_code");

-- CreateIndex
CREATE INDEX "price_alerts_whatsapp_idx" ON "price_alerts"("whatsapp");

-- CreateIndex
CREATE INDEX "price_alerts_expires_at_idx" ON "price_alerts"("expires_at");
