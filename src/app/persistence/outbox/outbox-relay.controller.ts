// // src/outbox-relay/outbox-relay.controller.ts (ou service, dependendo da sua organização)
// import { Controller } from '@nestjs/common';
// import {
//   EventPattern,
//   Ctx,
//   KafkaContext,
//   Payload,
// } from '@nestjs/microservices';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import {
//   OutboxDocument,
//   OutboxEntity,
// } from '@/src/app/persistence/outbox/mongo/outbox.document'; // Ajuste o path conforme seu projeto

// @Controller() // Ou @Injectable() se preferir que seja um serviço puro com um listener
// export class OutboxRelayConsumer {
//   constructor(
//     @InjectModel(OutboxEntity.name) private outboxModel: Model<OutboxDocument>,
//   ) {}

//   // O tópico 'dbserver.your_database.outbox' seria o tópico padrão do Debezium
//   // que espelha as mudanças na sua coleção 'outbox'.
//   @EventPattern('dbserver.your_database.outbox')
//   async handleOutboxEvent(
//     @Payload() message: any,
//     @Ctx() context: KafkaContext,
//   ) {
//     const originalMessage = context.getMessage();
//     const headers = originalMessage.headers;
//     const value = message; // O payload do Debezium estará aqui

//     // Debezium envia mensagens de 'CREATE', 'UPDATE', 'DELETE'.
//     // Você só estaria interessado nos eventos de 'CREATE' na sua tabela outbox.
//     const operation = value.op; // 'c' para create, 'u' para update, 'd' para delete

//     if (operation === 'c') {
//       // Apenas processa novas entradas na outbox
//       try {
//         const outboxEntry = value.after; // 'after' contém o estado da linha após a operação

//         if (!outboxEntry) {
//           console.warn(
//             'Received Debezium event with no "after" state. Skipping.',
//           );
//           return;
//         }

//         // Você precisará mapear o payload do Debezium para o formato esperado
//         const payloadToSend = {
//           aggregateType: outboxEntry.aggregateType,
//           aggregateId: outboxEntry.aggregateId,
//           eventType: outboxEntry.eventType,
//           payload: outboxEntry.payload,
//         };

//         // Enviar a mensagem para o tópico "final" de eventos (ex: 'orders_events')
//         // Você precisaria de um KafkaProducerService injetado aqui.
//         // Ex: this.kafkaProducerService.sendMessage('orders_events', payloadToSend);
//         console.log(`Sending order event: ${JSON.stringify(payloadToSend)}`);

//         // Após o envio bem-sucedido para o tópico 'orders_events',
//         // você **não precisa mais atualizar `processed: true`** na tabela Outbox.
//         // O Debezium já garante que o evento foi capturado.
//         // A lógica de `processed: true` na tabela outbox é mais para o cenário de polling.
//         // Com Debezium, a responsabilidade de marcar como 'processado' é do offset do Kafka Consumer.
//         // Se a mensagem falhar aqui, o Kafka reentregará.
//         // Se precisar de rastreamento de "processado", você faria isso em um armazenamento separado,
//         // ou confiaria no offset do Kafka.
//       } catch (error) {
//         console.error(
//           `Error processing outbox event from Debezium: ${error.message}`,
//         );
//         // NestJS Microservices com Kafka geralmente lida com o reprocessamento
//         // se uma exceção for lançada (dependendo da sua configuração de erro).
//       }
//     }
//   }
// }
