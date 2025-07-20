import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Observable } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';

@Injectable()
export class TypeORMTransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Disponibiliza na request para ser injetado nos serviços/repositórios
    const request = context.switchToHttp().getRequest();
    request.queryRunner = queryRunner;

    return next.handle().pipe(
      tap(async () => {
        await queryRunner.commitTransaction();
      }),
      catchError(async (error) => {
        await queryRunner.rollbackTransaction();
        throw error;
      }),
      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}

// Ou injeta globalmente
// app.useGlobalInterceptors(new TransactionInterceptor(dataSource));

// Ou injeta no módulo específico
// @UseInterceptors(TransactionInterceptor)
// @Controller('orders')
// export class OrderController { ... }

// Assim deve ser usado com os serviços/repositórios
// @CommandHandler(CreateOrderCommand)
// @Scope(Scope.REQUEST)
// export class CreateOrderCommandHandler
//   implements ICommandHandler<CreateOrderCommand>
// {
//   constructor(
//     private readonly createOrderService: CreateOrderService,
//     private readonly cacheService: CacheService,
//     private readonly outboxRepository: OutboxTypeORMRepository,

//     @Inject(REQUEST)
//     private readonly request: Request,
//   ) {}

//   async execute(command: CreateOrderCommand): Promise<OrderOuput> {
//     const manager = this.request.queryRunner.manager;

//     const domainInput = OrderMapper.toDomainInput(command.data);
//     const { order, events } = await this.createOrderService.execute(
//       domainInput,
//       manager,
//     );

//     await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);

//     for (const event of events) {
//       await this.outboxRepository.save(event, manager);
//     }

//     return OrderMapper.fromEntitytoGraphQLOrderOutput(order);
//   }
// }
