import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // --- SWAGGER CONFIGURATIE ---
  const config = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('De API documentatie voor ons Transcendence project')
    .setVersion('1.0')
    .addBearerAuth() // Dit zorgt voor een "Authorize" knopje voor je JWT tokens later!
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // Dit vertelt NestJS: Zet de documentatie website op '/api'
  SwaggerModule.setup('api', app, document);
  // ----------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();