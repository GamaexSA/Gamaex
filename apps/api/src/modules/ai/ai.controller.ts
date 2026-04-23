import { Controller, Get, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { ApiKeyGuard } from "./guards/api-key.guard";

@UseGuards(ApiKeyGuard)
@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  /** Tasas actuales + contexto del negocio para el asistente IA */
  @Get("rates")
  getRates() {
    return this.ai.getRatesForAi();
  }

  /** Solo contexto del negocio (sin precios) */
  @Get("context")
  getContext() {
    return this.ai.getBusinessContext();
  }
}
