import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
// import { OrderItemSeeder } from './modules/order/application/order-item.seeders';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const seeder = app.get(OrderItemSeeder);
  // await seeder.seed();
  await app.listen(3000);
}
bootstrap();
