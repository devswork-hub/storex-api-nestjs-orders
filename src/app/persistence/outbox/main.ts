// src/main.ts (para o serviço de Outbox Relay)
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OutboxRelayModule } from './outbox.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Importe uma vez para toda a aplicação
  ],
})
class CustoModule {}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OutboxRelayModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'], // Seus brokers Kafka
        },
        consumer: {
          groupId: 'outbox-relay-group', // Grupo de consumidores
        },
      },
    },
  );
  await app.listen();
  console.log('Outbox Relay Microservice is running');
}
bootstrap();
