// import { Injectable } from '@nestjs/common';
// import { MessagePattern } from '@nestjs/microservices';
// import { UpdateOrderService } from '../../domain/usecases/update-order.service';

import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

// @Injectable()
// export class OrderEventHandlers {
//   constructor(private readonly updateOrder: UpdateOrderService) {}
//   @MessagePattern('payment.created')
//   handlePaymentCreated(data: any): void {
//     this.updateOrder.execute({ ...})
//     console.log('Payment created event received:', data);
//     // Handle the payment created event logic here
//   }
// }

// MOdelo do evento a ser recebido
// {
//   "type": "PaymentConfirmed",
//   "data": {
//     "orderId": "order_123456",
//     "transactionId": "tx_abc123",
//     "status": "CONFIRMED",
//     "method": "pix"
//   }
// }

// @RabbitSubscribe({
//   exchange: 'payments',
//   routingKey: 'payment.confirmed',
//   queue: 'order-payment-confirmed',
// })
// async handlePaymentConfirmed(event: PaymentConfirmedEvent) {
//   const { orderId, transactionId, method } = event.data;

//   const order = await this.orderRepository.findById(orderId);

//   order.updatePaymentStatus({
//     transactionId,
//     method,
//     status: 'CONFIRMED'
//   });

//   await this.orderRepository.save(order);

//   this.eventBus.publish(new OrderPaidEvent(orderId));
// }

// Na API de pagamentos, essa eh a estrutura esperada pro banco de dados
// Uma tabela que armazena os pagamentos e, outra para os attempts
// {
//   "paymentId": "pay_abc123",
//   "orderId": "order_123",
//   "status": "PENDING",
//   "amount": 159.7,
//   "attempts": [
//     {
//       "id": "attempt_1",
//       "method": "credit_card",
//       "status": "FAILED",
//       "reason": "Cartão sem limite"
//     },
//     {
//       "id": "attempt_2",
//       "method": "pix",
//       "status": "PENDING"
//     }
//   ]
// }

// ISSO AQUI, EH CONSIDERANDO QUE EU QUERO CRIAR UMA LIB DE EVENTOS, PRA EU MANTER A CONSISTÊNCIA
// ENTRE OS MÓDULOS, E NÃO PRECISAR FICAR CRIANDO NOVOS EVENTOS
// AQUI, EU ESTOU CRIANDO UM EVENTO DE PAGAMENTO CRIADO, QUE PODE SER USADO POR OUTROS MÓDULOS
// export const PAYMENT_CREATED_EVENT = 'payment.created.v1';

// events/payment-created.ts
// export interface PaymentCreatedEvent {
//   paymentId: string;
//   orderId: string;
//   amount: number;
//   method: 'credit_card' | 'pix';
//   status: 'PENDING' | 'FAILED' | 'CONFIRMED';
// }

// export const PAYMENT_CREATED_EVENT = 'payment.created.v1';

// export const PaymentCreatedSchema = z.object({
//   paymentId: z.string(),
//   orderId: z.string(),
//   amount: z.number(),
//   method: z.enum(['credit_card', 'pix']),
//   status: z.enum(['PENDING', 'FAILED', 'CONFIRMED']),
// });

// export function emitPaymentCreated(event: PaymentCreatedEvent) {
//   return rabbitmq.publish(PAYMENT_CREATED_EVENT, event);
// }

// export function parsePaymentCreated(payload: unknown): PaymentCreatedEvent {
//   return PaymentCreatedSchema.parse(payload);
// }

// libs/
// └── events/
//     ├── index.ts
//     ├── constants/
//     │   └── event-names.ts
//     ├── schemas/
//     │   └── payment-created.schema.ts
//     ├── types/
//     │   └── payment-created.ts
//     ├── helpers/
//     │   └── emit-payment-created.ts
//     └── consumers/
//         └── handle-payment-created.ts
