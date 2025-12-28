import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderGraphQLInput } from '../../graphql/inputs/order.inputs';
import { CreateOrderService } from '../../../domain/usecases/create-order/create-order.service';
import { CreateOrderValidation } from '../../../domain/usecases/create-order/create-order.validation';
import { OrderMapper } from '../../order.mapper';
import { TypeORMUnitOfWork } from '@/app/persistence/typeorm/typeorm-uow.service';
import { Inject, Logger } from '@nestjs/common';
import { OrderWritableRepositoryContract } from '../../persistence/order.respository';
import { OutboxDomainEventPublisher } from '@/app/persistence/outbox/outbox-domain-events.publisher';
import { OrderCreatedEvent } from '@/modules/order/domain/events/order-created.event';
import { OrderIdempotencyRepository } from '@/app/idempotency/idempotency.repository';

export class CreateOrderCommand {
  constructor(public readonly data: CreateOrderGraphQLInput) {}
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderTransactionCommandHandler implements ICommandHandler<CreateOrderCommand> {
  private readonly logger = new Logger(
    CreateOrderTransactionCommandHandler.name,
  );

  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly uow: TypeORMUnitOfWork,
    /**
     * Usando o inject, pra nao precisar declarar todos os providers explicitamente na useFactory na injecao dos providers
     */
    /**
     * Toda vez que eu tiver OrderWritableRepositoryContract,
     * o Nest vai injetar a implementação configurada (OrderTypeORMRepository).
     * - Token no @Inject → garante que o Nest saiba qual provider instanciar.
     * - Tipo da propriedade → garante que o seu código só use o que o contrato expõe.
     */
    @Inject('OrderWritableRepositoryContract')
    private readonly orderRepository: OrderWritableRepositoryContract,
    private readonly domainPublisher: OutboxDomainEventPublisher,
    private readonly eventBus: EventBus,
    private readonly ir: OrderIdempotencyRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<any> {
    try {
      this.executeValidations(command);

      const clientId = 'example_client_id'; // vem do gateway / auth
      const idempotencyKey = 'example_ik'; // vem do header

      this.logger.debug('[CreateOrder] Iniciando transação...');
      const { output, result } = await this.uow.startTransaction(
        async (manager) => {
          this.logger.debug(
            '[CreateOrder] Dentro da transação (before service)',
          );

          this.orderRepository.setTransactionManager(manager);
          // Idempotência SEMPRE deve ser validada dentro da mesma transação que cria o pedido
          this.ir.setTransactionManager(manager);

          // 🔹 1. Checa idempotência
          const existing = await this.ir.find(clientId, idempotencyKey);

          if (existing) {
            const order = await this.orderRepository.findById(existing.orderId);
            return {
              output: OrderMapper.fromEntitytoGraphQLOrderOutput(order),
            };
          }

          const domainInput = OrderMapper.fromGraphqlInputToDomainInput(
            command.data,
          );

          const { order, events } =
            await this.createOrderService.execute(domainInput);

          // 🔹 3. Salva idempotência
          await this.ir.save({
            clientId,
            idempotencyKey,
            orderId: order.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 dias
            createdAt: new Date(),
          });

          this.logger.debug('[CreateOrder] Pedido criado, eventos capturados');

          await this.domainPublisher.publishAll(events, manager);

          this.logger.debug('[CreateOrder] Eventos publicados no outbox');

          return {
            output: OrderMapper.fromEntitytoGraphQLOrderOutput(order),
            result: order,
          };
        },
      );

      this.logger.debug(
        '[CreateOrder] Transação finalizada, antes da invalidação do cache',
      );
      this.logger.debug('[CreateOrder] Cache invalidado com sucesso');
      this.eventBus.publish(new OrderCreatedEvent(result));
      return output;
    } catch (error) {
      this.logger.error(
        `Falha ao processar o pedido: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private executeValidations(command: CreateOrderCommand) {
    const { data } = command;
    const validations = new CreateOrderValidation();
    validations.validate(data);
  }
}
