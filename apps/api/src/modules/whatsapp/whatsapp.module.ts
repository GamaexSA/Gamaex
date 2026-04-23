import { Module } from "@nestjs/common";
import { WhatsAppService } from "./whatsapp.service";
import { WhatsAppController } from "./whatsapp.controller";
import { CurrenciesModule } from "../currencies/currencies.module";
import { RatesModule } from "../rates/rates.module";

@Module({
  imports: [CurrenciesModule, RatesModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
})
export class WhatsAppModule {}
