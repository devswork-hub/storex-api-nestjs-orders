import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DomainSeeders } from './modules/order/application/domain.seeders';
import { TimeoutInterceptor } from './app/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './app/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigSchemaType } from './app/config/config.values';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new TimeoutInterceptor(), new LoggingInterceptor());

  // TODO: falta adicionar a dependencia class-validator
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const configService = app
    .select(AppModule)
    .get(ConfigService<ConfigSchemaType>);

  // if (process.env.RUN_SEED === 'true') {
  //   const seeder = app.get(DomainSeeders);
  //   await seeder.run();
  //   await app.close(); // encerra após o seed
  //   return;
  // }

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
