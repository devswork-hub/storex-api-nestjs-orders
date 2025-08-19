// rabbitmq-wrapper.module.ts
import { Global, Module } from '@nestjs/common';
import { RabbitMQModule as GoLevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RmqPublisherService } from './rmq-publisher.service';
import { InMemoryBroker } from './in-memory-broker';
import { OrdersRabbitMQController } from './orders-rabbitmq.controller';

@Global()
@Module({
imports: [
GoLevelupRabbitMQModule.forRoot({
uri: 'amqp://admin:admin@localhost:5672',
exchanges: [
{ name: 'dlx.exchange', type: 'topic' },
{
name: 'direct.delayed', // O exchange de atraso
type: 'x-delayed-message',
options: {
arguments: {
'x-delayed-type': 'direct',
},
},
},
{ name: 'orders-topic-exchange', type: 'topic' },
],
queues: [
{
name: 'dlx.queue',
exchange: 'dlx.exchange',
routingKey: '#', // Aceita qualquer routing key
},
// A fila que lida com o processamento do pedido (não será alterada)
{
name: 'orders-queue',
options: {
durable: true,
arguments: {
'x-dead-letter-exchange': 'dlx.exchange',
'x-dead-letter-routing-key': 'order.created',
},
},
routingKey: ['order.created'],
exchange: 'orders-topic-exchange',
},
// A fila que irá receber a mensagem **APÓS O ATRASO**
{
name: 'delayed-emails-queue',
options: {
durable: true,
},
routingKey: ['order.created'],
exchange: 'direct.delayed', // Vinculada ao exchange de atraso
},
],
enableControllerDiscovery: true,
}),
],
controllers: [OrdersRabbitMQController], // Adicione o controller aqui para que as rotas sejam descobertas
providers: [
RmqPublisherService,
{ provide: 'MessageBrokerContract', useClass: InMemoryBroker },
],
exports: [
GoLevelupRabbitMQModule,
RmqPublisherService,
'MessageBrokerContract',
],
})
export class RabbitmqWrapperModule {}

// orders-rabbitmq.controller.ts
import {
BadRequestException,
Controller,
Injectable,
Logger,
UseFilters,
} from '@nestjs/common';
import { AmqpConnection, Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQConsumerErrorFilter } from '@/app/messaging/rabbitmq/rabbitmq-consumer-error.filter';

@Controller()
@UseFilters(new RabbitMQConsumerErrorFilter())
export class OrdersRabbitMQController {
private readonly logger = new Logger(OrdersRabbitMQController.name);

// Injete o AmqpConnection para publicar mensagens
constructor(private readonly amqpConnection: AmqpConnection) {}

@RabbitSubscribe({
exchange: 'orders-topic-exchange',
queue: 'orders-queue',
routingKey: 'order.created',
allowNonJsonMessages: true,
queueOptions: {
deadLetterExchange: 'dlx.exchange',
deadLetterRoutingKey: 'order.created',
},
})
handleOrder(message: any) {
this.logger.log(`Received order message: ${JSON.stringify(message)}`);

    // ** CENÁRIO DE USO DO DELAYED EXCHANGE **
    // Publica uma mensagem no exchange de atraso. A mensagem será entregue à fila 'delayed-emails-queue' após 30 segundos.
    this.amqpConnection.publish(
      'direct.delayed',
      'order.created',
      { customerId: message.customerId, orderId: message.orderId },
      { headers: { 'x-delay': 30000 } } // O cabeçalho 'x-delay' é o segredo!
    );

    this.logger.log('Published delayed email message to direct.delayed exchange.');

}

@RabbitSubscribe({
exchange: 'direct.delayed',
queue: 'delayed-emails-queue',
routingKey: 'order.created',
})
handleDelayedEmail(message: any) {
this.logger.log(`Received delayed email message after 30 seconds: ${JSON.stringify(message)}`);
// Aqui você pode enviar o e-mail real para o cliente.
// Este consumidor só é ativado 30 segundos depois que a mensagem é publicada.
// Lembre-se, o objetivo aqui é a entrega **agendada**, não uma retentativa.
}
}
