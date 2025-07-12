// // src/modules/order/application/services/outbox-event.dispatcher.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { OutboxRepository } from '../../persistence/outbox/outbox-repository';
// import { EventBus } from '@nestjs/cqrs';

// @Injectable()
// export class OutboxEventDispatcher {
//   private readonly logger = new Logger(OutboxEventDispatcher.name);

//   constructor(
//     private readonly outboxRepository: OutboxRepository,
//     private readonly eventBus: EventBus, // Opcional: para publicar eventos internos no NestJS CQRS
//     private readonly messageBrokerService: MessageBrokerService, // Seu serviço de mensageria
//   ) {}

//   // Este cron job será executado a cada 10 segundos
//   @Cron(CronExpression.EVERY_10_SECONDS)
//   async dispatchUnprocessedEvents() {
//     this.logger.debug('Procurando eventos não processados no Outbox...');
//     try {
//       const unprocessedEvents =
//         await this.outboxRepository.findUnprocessedEvents();

//       if (unprocessedEvents.length === 0) {
//         this.logger.debug('Nenhum evento não processado encontrado.');
//         return;
//       }

//       for (const event of unprocessedEvents) {
//         try {
//           // Publicar o evento para o sistema de mensagens (ex: Kafka)
//           // Adapte isso para o seu MessageBrokerService
//           await this.messageBrokerService.publish(
//             event.eventType,
//             event.payload,
//           );
//           this.logger.log(
//             `Evento '${event.eventType}' (ID: ${event._id}) publicado com sucesso.`,
//           );

//           // Marcar o evento como processado
//           await this.outboxRepository.markEventAsProcessed(
//             event._id.toString(),
//           );
//           this.logger.log(`Evento (ID: ${event._id}) marcado como processado.`);

//           // Opcional: Publicar o evento no EventBus interno do NestJS CQRS se necessário
//           // this.eventBus.publish(new YourInternalEvent(event.payload));
//         } catch (eventError) {
//           this.logger.error(
//             `Falha ao processar ou publicar evento (ID: ${event._id}, Tipo: ${event.eventType}): ${eventError.message}`,
//             eventError.stack,
//           );
//           // Você pode querer adicionar lógica de retry ou mover para um status de 'failed'
//           // em vez de simplesmente lançar o erro aqui, para não parar o processamento de outros eventos.
//           // await this.outboxRepository.markEventAsFailed(event._id.toString(), eventError.message);
//         }
//       }
//     } catch (error) {
//       this.logger.error(
//         `Erro ao buscar ou despachar eventos do Outbox: ${error.message}`,
//         error.stack,
//       );
//     }
//   }
// }
