import { Injectable, Inject, Logger } from "@nestjs/common";
import { PrismaClient } from "@gamaex/database";
import { PRISMA_TOKEN } from "../database/database.module";
import { CurrenciesService } from "../currencies/currencies.service";
import { RatesService } from "../rates/rates.service";

interface WaTextMessage {
  from: string;
  type: string;
  text?: { body: string };
}

interface WaWebhookPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: WaTextMessage[];
      };
    }>;
  }>;
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(
    @Inject(PRISMA_TOKEN) private readonly db: PrismaClient,
    private readonly currencies: CurrenciesService,
    private readonly rates: RatesService,
  ) {}

  async handleWebhook(payload: unknown): Promise<void> {
    const data = payload as WaWebhookPayload;
    const messages = data.entry?.[0]?.changes?.[0]?.value?.messages;
    if (!messages?.length) return;

    for (const msg of messages) {
      if (msg.type !== "text" || !msg.text?.body) continue;
      await this.processMessage(msg.from, msg.text.body.trim());
    }
  }

  private async processMessage(from: string, text: string): Promise<void> {
    const allowed = await this.db.whatsappAllowedNumber.findUnique({
      where: { phone: from },
    });

    if (!allowed?.is_active) {
      this.logger.warn(`Mensaje de número no autorizado: ${from}`);
      return;
    }

    const actorRef = `whatsapp:${from}`;
    const upper = text.toUpperCase();

    try {
      // "USD compra 940 venta 952" → precios manuales
      const manualMatch = /^([A-Z]{3})\s+COMPRA\s+(\d+(?:[.,]\d+)?)\s+VENTA\s+(\d+(?:[.,]\d+)?)$/.exec(upper);
      if (manualMatch) {
        const code = manualMatch[1]!;
        const buy = manualMatch[2]!;
        const sell = manualMatch[3]!;
        await this.currencies.setManualPrices(
          code,
          { manual_buy: parseFloat(buy.replace(",", ".")), manual_sell: parseFloat(sell.replace(",", ".")) },
          actorRef,
        );
        this.logger.log(`WA ${from}: precios manuales ${code} compra=${buy} venta=${sell}`);
        return;
      }

      // "USD márgenes compra -5 venta 8" → actualizar márgenes
      const marginMatch = /^([A-Z]{3})\s+M[AÁ]RGENES?\s+COMPRA\s+([+-]?\d+(?:[.,]\d+)?)\s+VENTA\s+([+-]?\d+(?:[.,]\d+)?)$/.exec(upper);
      if (marginMatch) {
        const code = marginMatch[1]!;
        const buy = marginMatch[2]!;
        const sell = marginMatch[3]!;
        await this.currencies.updateMargins(
          code,
          { buy_margin: parseFloat(buy.replace(",", ".")), sell_margin: parseFloat(sell.replace(",", ".")) },
          actorRef,
        );
        this.logger.log(`WA ${from}: márgenes ${code} compra=${buy} venta=${sell}`);
        return;
      }

      // "USD auto" → volver a modo automático
      const autoMatch = /^([A-Z]{3})\s+AUTO$/.exec(upper);
      if (autoMatch) {
        await this.currencies.switchToAuto(autoMatch[1]!, actorRef);
        this.logger.log(`WA ${from}: switch AUTO ${autoMatch[1]}`);
        return;
      }

      // "sync USD" o "sync all" → forzar sync
      const syncMatch = /^SYNC\s+([A-Z]{3}|ALL)$/.exec(upper);
      if (syncMatch) {
        const target = syncMatch[1]!;
        if (target === "ALL") {
          await this.rates.forceSync(undefined, actorRef);
        } else {
          await this.rates.forceSync([target], actorRef);
        }
        this.logger.log(`WA ${from}: force sync ${target}`);
        return;
      }

      this.logger.debug(`WA ${from}: comando no reconocido: "${text}"`);
    } catch (err) {
      this.logger.error(`WA ${from}: error procesando "${text}":`, err);
    }
  }
}
