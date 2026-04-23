import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  // Prefijo global de la API
  app.setGlobalPrefix("api");

  // Validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // elimina props no declaradas en el DTO
      forbidNonWhitelisted: true,
      transform: true,        // convierte tipos automáticamente
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // CORS — solo dominios autorizados
  app.enableCors({
    origin: process.env["ALLOWED_ORIGINS"]?.split(",") ?? [
      "http://localhost:3000",
      "http://localhost:3002",
    ],
    credentials: true,
  });

  // Render inyecta PORT automáticamente; API_PORT queda como fallback local
  const port = process.env["PORT"] ?? process.env["API_PORT"] ?? 3001;
  await app.listen(port, "0.0.0.0");

  logger.log(`🚀 API corriendo en http://localhost:${port}/api`);
}

bootstrap();
