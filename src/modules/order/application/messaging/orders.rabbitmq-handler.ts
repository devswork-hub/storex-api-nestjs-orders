// import { Controller, ServiceUnavailableException } from '@nestjs/common';
// import { MessagePattern, Payload } from '@nestjs/microservices';
// import { MESSAGE_PATTERNS } from './message-patterns';

// let counter = 0;

// @Controller()
// export class OrdersRabbitMQController {
//   constructor() {}

//   @MessagePattern({ cmd: MESSAGE_PATTERNS.ORDER_CREATED })
//   async createOrder() {
//     console.log('✅ Evento recebido');
//     // counter++;
//     // // try {
//     // //   console.log('Received order data:', data);
//     // // } catch (error) {
//     // //   throw new ServiceUnavailableException(
//     // //     'Service unavailable, please try again later',
//     // //   );
//     // // }
//     // console.log(`🔔 Recebido pedido: #${counter}`, data);

//     // // A cada 3ª mensagem recebida, lançar erro
//     // if (counter % 3 === 0) {
//     //   console.error('❌ Falha simulada no processamento do pedido');
//     //   throw new Error('Erro simulado no processamento do pedido');
//     // }

//     // console.log('✅ Pedido processado com sucesso');
//   }
// }
