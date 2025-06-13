import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OrderItemSeeder } from './modules/orders/order.domain-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get(OrderItemSeeder);
  await seeder.seed();
  await app.listen(3000);
}
bootstrap();
