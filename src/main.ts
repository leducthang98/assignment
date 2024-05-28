import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { initSwagger } from './configs/swagger.config';
import { AppConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.modules';

async function bootstrap() {
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: AppConfigService = app
    .select(SharedModule)
    .get(AppConfigService);

  const port: string = configService.getEnv('PORT');
  const appName: string = configService.getEnv('APP_NAME');

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enable('trust proxy');
  app.enableCors();
  app.enableShutdownHooks();

  initSwagger(app, appName);

  await app.listen(port, () => {
    console.info(`🚀 server starts at ${port}!`);
  });
}

bootstrap();
