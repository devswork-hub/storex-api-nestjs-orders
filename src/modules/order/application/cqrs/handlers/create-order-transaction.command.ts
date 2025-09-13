import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderGraphQLInput } from '../../graphql/inputs/order.inputs';
import { CreateOrderService } from '../../../domain/usecases/create-order/create-order.service';
import { CreateOrderValidation } from '../../../domain/usecases/create-order/create-order.validation';
import { OrderMapper } from '../../order.mapper';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { CacheService } from '../../../../../app/persistence/cache/cache.service';
import { OutboxTypeORMService } from '@/app/persistence/outbox/typeorm/outbox-typeorm.service';
import { TypeORMUnitOfWork } from '@/app/persistence/typeorm/typeorm-uow.service';
import { Inject, Logger } from '@nestjs/common';
import { MailQueueService } from '@/app/integrations/mail/mail-queue.service';
import { OrderWritableRepositoryContract } from '../../persistence/order.respository';

export class CreateOrderCommand {
  constructor(public readonly data: CreateOrderGraphQLInput) {}
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderTransactionCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  private readonly logger = new Logger(
    CreateOrderTransactionCommandHandler.name,
  );

  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly cacheService: CacheService,
    private readonly outboxService: OutboxTypeORMService,
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
    private readonly mailQueueService: MailQueueService,
  ) {}

  async execute(command: CreateOrderCommand): Promise<any> {
    this.logger.log(
      `Iniciando a criação do pedido para o cliente: ${command.data.customerSnapshot.email}`,
    );

    try {
      this.executeValidations(command);

      const result = await this.uow.startTransaction(async (manager) => {
        this.orderRepository.setTransactionManager(manager);

        const domainInput = OrderMapper.fromGraphqlInputToDomainInput(
          command.data,
        );
        const { order, events } =
          await this.createOrderService.execute(domainInput);

        await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);

        for (const event of events) {
          await this.outboxService.save(event, manager);
        }

        await this.mailQueueService.dispatchTasks({
          payload: {
            to: order.customerSnapshot.email,
            subject: 'Confirmação do Pedido',
            body: `Olá ${order.customerSnapshot.name}, seu pedido foi recebido com sucesso!`,
          },
        });

        return OrderMapper.fromEntitytoGraphQLOrderOutput(order);
      });

      this.logger.log(`Pedido ${result.id} criado e processado com sucesso.`);
      return result;
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
