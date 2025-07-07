/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';

const flagPath = path.join(__dirname, 'swagger-opened.flag');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.setGlobalPrefix('q-smart-doc/api');
  app.enableCors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Q-SMART-DOC API')
    .setDescription('API documentation for Q-SMART-DOC')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('q-smart-doc/api', app, document);

  await app.listen(3000);

  if (!fs.existsSync(flagPath)) {
    exec('start http://localhost:3000/q-smart-doc/api');
    fs.writeFileSync(flagPath, 'opened');
  }
}
bootstrap();
