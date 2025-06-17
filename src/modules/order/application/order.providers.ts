import { OrderRepositoryContract } from '../persistence/order.repository';
import { OrderInMemoryRepository } from '../persistence/order.in-memory.repository';
import { OrderMongoRepository } from './order.mongo-repository';
import { CreateOrderService } from '../usecases/create-order.usecase';
import { FindAllOrderService } from '../usecases/find-all-orders.service';
import { Model } from 'mongoose';
import { OrderMongoSchema } from './mongo/order.schema';
import { OrderItem } from './graphql/schemas/order-item.schema';

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
      orderModel: Model<OrderMongoSchema>,
      orderItemModel: Model<OrderItem>,
    ) => {
      // Retorna uma nova instância do repositório com os modelos injetados
      return new OrderMongoRepository(orderModel, orderItemModel);
    },
    inject: [
      'OrderMongoSchemaModel', // Esse nome precisa bater com o nome passado no MongooseModule.forFeature
      'OrderItem', // Idem aqui
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
