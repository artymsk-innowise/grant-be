import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  app.enableCors();

  const serverUrl = config.get('SERVER_URL');
  const port = config.get('PORT');
  
  await app.listen(port);
  Logger.log(`App is started on ${serverUrl}:${port}`);
}

bootstrap();
