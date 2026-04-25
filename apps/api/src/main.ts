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

  const allowedOrigins = process.env["ALLOWED_ORIGINS"]
    ? process.env["ALLOWED_ORIGINS"].split(",").map((o) => o.trim())
    : ["http://localhost:3000", "http://localhost:3002"];

  logger.log(`CORS origins: ${allowedOrigins.join(", ")}`);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado: ${origin}`), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Render inyecta PORT automáticamente; API_PORT queda como fallback local
  const port = process.env["PORT"] ?? process.env["API_PORT"] ?? 3001;
  await app.listen(port, "0.0.0.0");

  logger.log(`🚀 API corriendo en http://localhost:${port}/api`);
}

bootstrap();
