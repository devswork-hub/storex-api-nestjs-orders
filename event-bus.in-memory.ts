// // event-bus.in-memory.ts
// type EventHandler = (event: any) => Promise<void> | void;

// export class InMemoryEventBus {
//   private listeners = new Map<string, EventHandler[]>();

//   publish(event: any) {
//     const eventName = event.constructor.name;
//     const handlers = this.listeners.get(eventName) || [];
//     for (const handler of handlers) {
//       handler(event); // pode ser async, mas não bloqueia
//     }
//   }

//   subscribe(eventName: string, handler: EventHandler) {
//     if (!this.listeners.has(eventName)) {
//       this.listeners.set(eventName, []);
//     }
//     this.listeners.get(eventName).push(handler);
//   }
// }

// // events/order-created.event.ts
// export class OrderCreatedEvent {
//   constructor(public readonly orderId: string) {}
// }

// // handlers/order-created.handler.ts
// export class OrderCreatedHandler {
//   handle(event: OrderCreatedEvent) {
//     console.log(`Pedido criado: ${event.orderId}`);
//     // aqui você pode disparar lógica, notificar, etc
//   }
// }

// // usecases/create-order.usecase.ts
// import { InMemoryEventBus } from './event-bus.in-memory';
// import { OrderCreatedEvent } from '../events/order-created.event';

// export class CreateOrderUseCase {
//   constructor(
//     private readonly orderRepository: OrderInMemoryRepository,
//     private readonly eventBus: InMemoryEventBus,
//   ) {}

//   async execute(orderInput: any) {
//     const order = await this.orderRepository.createOne(orderInput);

//     // Dispara evento depois que o pedido foi criado
//     this.eventBus.publish(new OrderCreatedEvent(order.id));

//     return order;
//   }
// }

// const eventBus = new InMemoryEventBus();
// const orderCreatedHandler = new OrderCreatedHandler();

// // Assina o evento
// eventBus.subscribe('OrderCreatedEvent', (event) =>
//   orderCreatedHandler.handle(event),
// );
// async function main() {
//   const repo = new OrderInMemoryRepository();
//   const eventBus = new InMemoryEventBus();
//   const createOrderUseCase = new CreateOrderUseCase(repo, eventBus);
//   const orderCreatedHandler = new OrderCreatedHandler();

//   // Registra handler
//   eventBus.subscribe('OrderCreatedEvent', (event) =>
//     orderCreatedHandler.handle(event),
//   );

//   // Cria pedido
//   const newOrder = await createOrderUseCase.execute({
//     id: '123',
//     item: 'Camisa',
//   });

//   console.log('Pedido criado:', newOrder);
// }

// main();

// /**
//  * 🧠 Então o que quer dizer "preparado para eventos"?

// Quando você usa CommandBus, QueryBus e segue CQRS, seu sistema:

// Já está separado em handlers (com responsabilidade única)
// Usa bus para orquestrar comandos e consultas
// Fica natural adicionar também um EventBus para reagir a eventos
// Ou seja, você está com a casa arrumada para dizer:

// “Agora, além de comandos e queries, vou reagir a eventos.”
//  */

// // No seu CreateOrderHandler
// await this.orderRepository.createOne(order);
// this.eventBus.publish(new OrderCreatedEvent(order.id));

// @EventsHandler(OrderCreatedEvent)
// export class SendEmailOnOrderCreatedHandler {
//   handle(event: OrderCreatedEvent) {
//     this.emailService.send({
//       to: 'cliente@example.com',
//       subject: 'Seu pedido foi recebido!',
//     });
//   }
// }
