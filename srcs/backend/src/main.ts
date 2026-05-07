import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/api/uploads/',
  });

  const config = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription(`
De API documentatie voor ons Transcendence project

⚡ Rate Limiting (Nginx enforced):
- API (/api/*): 10 requests per second per IP
- Burst allowance: 20 requests
- Uploads (/api/uploads): stricter burst limit (10)
- Exceeding limits returns: 429 Too Many Requests

🔐 Authentication:
- JWT Bearer token required for protected routes

📡 WebSocket:
- Socket.IO available at /socket.io/
  	`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document); 

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
