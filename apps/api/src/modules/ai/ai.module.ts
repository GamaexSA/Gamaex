import { Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
import { RatesModule } from "../rates/rates.module";

@Module({
  imports: [RatesModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
