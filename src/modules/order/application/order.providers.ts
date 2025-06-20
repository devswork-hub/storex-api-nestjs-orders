import { OrderMongoRepository } from './order.mongo-repository';
import { Model } from 'mongoose';
import { OrderItem } from './graphql/schemas/order-item.schema';
import { OrderInMemoryRepository } from '../domain/persistence/order.in-memory.repository';
import { OrderMongoEntity } from './mongo/order.document';
import { OrderRepositoryContract } from '../domain/persistence/order.repository';
import { FindAllOrderService } from '../domain/usecases/find-all-order.service';
import { CreateOrderService } from '../domain/usecases/create-order/create-order.service';

export const repositories = {
  // Token principal usado para injeção do repositório de pedidos.
  // Aqui, usamos `useExisting` para apontar para o OrderMongoRepository como implementação padrão.
  ORDER_REPOSITORY: {
    provide: 'ORDER_REPOSITORY', // Token que será injetado via @Inject('ORDER_REPOSITORY')
    useExisting: OrderMongoRepository, // Classe concreta que será usada
  },

  // Provider explícito para o repositório em memória
  ORDER_IN_MEMORY_REPOSITORY: {
    provide: OrderInMemoryRepository,
    useClass: OrderInMemoryRepository,
  },

  // Provider para o repositório MongoDB usando fábrica
  ORDER_MONGO_REPOSITORY: {
    provide: OrderMongoRepository, // Token igual à classe (também pode ser usado em injeções)
    useFactory: (
      // Recebe as instâncias dos models via injeção (ver inject abaixo)
      orderModel: Model<OrderMongoEntity>,
    ) => {
      // Retorna uma nova instância do repositório com os modelos injetados
      return new OrderMongoRepository(orderModel);
    },
    inject: [
      'OrderMongoEntity', // Esse nome precisa bater com o nome passado no MongooseModule.forFeature
    ],
  },
};

export const usecases = {
  // Caso de uso para criar pedido
  CREATE_ORDER_USECASE: {
    provide: CreateOrderService, // Token é a própria classe
    useFactory: (orderRepository: OrderRepositoryContract) => {
      // Recebe o repositório como dependência e retorna o use case
      return new CreateOrderService(orderRepository);
    },
    inject: [repositories.ORDER_REPOSITORY.provide], // Injeta o token 'ORDER_REPOSITORY'
  },

  // Caso de uso para buscar todos os pedidos
  FIND_ALL_ORDER_USECASE: {
    provide: FindAllOrderService,
    useFactory: (orderRepository: OrderRepositoryContract) => {
      return new FindAllOrderService(orderRepository);
    },
    inject: [repositories.ORDER_REPOSITORY.provide],
  },
};

// Junta todos os providers para facilitar o import no módulo
export const orderProviders = [
  ...Object.values(repositories),
  ...Object.values(usecases),
];
