/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const flagPath = path.join(__dirname, 'swagger-opened.flag');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('q-smart-doc/api');
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

  // Kiểm tra nếu chưa mở Swagger thì mở và tạo flag
  if (!fs.existsSync(flagPath)) {
    exec('start http://localhost:3000/q-smart-doc/api');
    fs.writeFileSync(flagPath, 'opened');
  }
}
bootstrap();
