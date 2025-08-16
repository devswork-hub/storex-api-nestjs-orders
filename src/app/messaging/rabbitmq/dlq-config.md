# RabbitMQ + NestJS (`@golevelup/nestjs-rabbitmq`) – Guia de Configuração

Este documento explica como configurar RabbitMQ em um projeto NestJS utilizando a biblioteca [`@golevelup/nestjs-rabbitmq`](https://github.com/golevelup/nestjs/tree/main/libs/rabbitmq), cobrindo:

- Configuração de exchanges e filas
- Dead Letter Queue (DLX)
- Uso do decorator `@RabbitSubscribe`
- Evitar conflitos de argumentos (`PRECONDITION_FAILED`)

---

## 1️⃣ Configuração do RabbitMQ no Docker

Exemplo de serviço Docker Compose:

```yaml
services:
  rabbitmq:
    image: rabbitmq:3.9-management
    container_name: rabbitmq
    restart: always
    hostname: rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    ports:
      - 5672:5672 # AMQP
      - 15672:15672 # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

volumes:
  rabbitmq_data:
```

⚠️ Observações:

- Se o NestJS estiver em outro container, use o hostname do serviço (`rabbitmq`) na URI:
  `amqp://admin:admin@rabbitmq:5672`
- Para resetar filas e volumes antigos:

```bash
docker-compose down -v
docker-compose up -d
```

---

## 2️⃣ Configuração no NestJS

### Módulo RabbitMQ

```ts
import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot({
      uri: 'amqp://admin:admin@localhost:5672',
      exchanges: [
        {
          name: 'orders-topic-exchange',
          type: 'topic',
          options: { durable: true },
        },
        { name: 'dlx.exchange', type: 'topic', options: { durable: true } },
      ],
      queues: [
        {
          name: 'orders-queue',
          exchange: 'orders-topic-exchange',
          routingKey: ['order.created'],
          options: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'dlx.exchange',
              'x-dead-letter-routing-key': 'order.created',
            },
          },
        },
        {
          name: 'emails-queue',
          exchange: 'orders-topic-exchange',
          routingKey: ['order.created'],
          options: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'dlx.exchange',
              'x-dead-letter-routing-key': 'order.created',
            },
          },
        },
        {
          name: 'dlx.queue',
          exchange: 'dlx.exchange',
          routingKey: '#',
          options: { durable: true },
        },
      ],
      enableControllerDiscovery: true,
    }),
  ],
})
export class RabbitmqWrapperModule {}
```

---

### Controller de Consumers

```ts
import {
  Controller,
  Logger,
  UseFilters,
  BadRequestException,
} from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQConsumerErrorFilter } from './rabbitmq-consumer-error.filter';

@Controller()
@UseFilters(new RabbitMQConsumerErrorFilter())
export class OrdersRabbitMQController {
  private readonly logger = new Logger(OrdersRabbitMQController.name);

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    queue: 'orders-queue',
    routingKey: 'order.created',
    allowNonJsonMessages: true,
    queueOptions: {
      durable: true,
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'order.created',
    },
  })
  handle(message: any) {
    this.logger.log('Mensagem recebida em orders-queue', message);
  }

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    queue: 'emails-queue',
    routingKey: 'order.created',
    allowNonJsonMessages: true,
    queueOptions: {
      durable: true,
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'order.created',
    },
  })
  handleEmail(message: any) {
    this.logger.log('Mensagem recebida em emails-queue', message);
    throw new BadRequestException('Simulando erro');
  }
}
```

---

## 3️⃣ Observações Importantes

1. **Redundância necessária:**
   Mesmo declarando filas no `forRoot`, é necessário repetir `queueOptions` no `@RabbitSubscribe` quando há argumentos específicos (DLX, TTL, durable) para evitar `PRECONDITION_FAILED`.

2. **DLX (Dead Letter Queue):**

   - Mensagens rejeitadas ou expiradas vão para a fila de DLX.
   - Deve ser configurada tanto no `forRoot` quanto no `queueOptions` do decorator.

3. **Ambientes de desenvolvimento:**

   - Para testes rápidos, você pode usar apenas `@RabbitSubscribe` com `queueOptions` e não declarar filas no `forRoot`.
   - Em produção, recomenda-se declarar todas as filas/exchanges no módulo (`forRoot`) e deixar o decorator apenas consumir.

4. **Reset de filas persistentes:**
   Sempre que alterar argumentos de fila, use:

```bash
docker-compose down -v
docker-compose up -d
```

5. **Usuário e senha:**
   Certifique-se de que o usuário na URI (`amqp://user:pass@host:port`) corresponda ao usuário configurado no RabbitMQ, e que o container NestJS consiga resolver o hostname corretamente.

### Observacoes

- Mesmo que você declare a fila no forRoot, se o @RabbitSubscribe não tiver queueOptions, ele tenta declarar a fila “vazia” sem argumentos.
- Se a fila já existe com argumentos diferentes (por exemplo, DLX configurado no forRoot), o RabbitMQ lança PRECONDITION_FAILED.
- Pra isso, precisa duplicar os argumentos no decorator, mesmo que pareça redundante.

No GoLevelup, sempre que você usar DLX, TTL ou qualquer argumento de fila específico, precisa passar queueOptions também no @RabbitSubscribe.
É redundante, mas é o jeito de evitar conflito com o provisionamento do RabbitMQ

- No forRoot → garante que a fila e exchange existam antes do consumer subir.
- No @RabbitSubscribe (queueOptions) → garante que o consumer consiga declarar a fila com os mesmos argumentos, evitando PRECONDITION_FAILED.

> Mesmo parecendo redundante, isso é uma exigência do comportamento da lib, porque o consumer sempre tenta criar a fila na inicialização.
