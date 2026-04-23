import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpCode,
  Logger,
  ForbiddenException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WhatsAppService } from "./whatsapp.service";

@Controller("whatsapp")
export class WhatsAppController {
  private readonly logger = new Logger(WhatsAppController.name);

  constructor(
    private readonly wa: WhatsAppService,
    private readonly config: ConfigService,
  ) {}

  /** Verificación del webhook — Meta llama esto al configurar el endpoint */
  @Get("webhook")
  verify(
    @Query("hub.mode") mode: string,
    @Query("hub.challenge") challenge: string,
    @Query("hub.verify_token") token: string,
  ) {
    const expected = this.config.get<string>("WHATSAPP_VERIFY_TOKEN");
    if (mode === "subscribe" && token === expected) {
      return challenge;
    }
    this.logger.warn("Intento de verificación de webhook con token inválido");
    throw new ForbiddenException("Invalid verify token");
  }

  /** Mensajes entrantes desde Meta Platform */
  @Post("webhook")
  @HttpCode(200)
  handleMessage(@Body() body: unknown) {
    // Responder 200 inmediatamente — Meta requiere respuesta < 20s
    void this.wa.handleWebhook(body);
    return { ok: true };
  }
}
