// import { Test, TestingModule } from '@nestjs/testing';
// import { FindAllOrdersHandler } from './find-all-orders.handler';
// import { FindAllOrderService } from '@/modules/order/domain/usecases/find-all-order.service';
// import { CacheService } from '@/app/persistence/cache/cache.service';
// import { OrderMapper } from '../../order.mapper';
// import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';

// describe('FindAllOrdersHandler', () => {
//   let handler: FindAllOrdersHandler;
//   let findAllOrderService: FindAllOrderService;
//   let cacheService: CacheService;

//   const mockOrders = [
//     { id: 1, product: 'Product 1' },
//     { id: 2, product: 'Product 2' },
//   ];

//   const mockMappedOrders = mockOrders.map((o) =>
//     OrderMapper.fromEntitytoGraphQLOrderOutput(null),
//   );

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         FindAllOrdersHandler,
//         {
//           provide: FindAllOrderService,
//           useValue: { execute: jest.fn() },
//         },
//         {
//           provide: CacheService,
//           useValue: { get: jest.fn(), set: jest.fn() },
//         },
//       ],
//     }).compile();

//     handler = module.get<FindAllOrdersHandler>(FindAllOrdersHandler);
//     findAllOrderService = module.get<FindAllOrderService>(FindAllOrderService);
//     cacheService = module.get<CacheService>(CacheService);
//   });

//   it('should be defined', () => {
//     expect(handler).toBeDefined();
//   });

//   // it('should return cached orders if cache exists', async () => {
//   //   (cacheService.get as jest.Mock).mockResolvedValue(mockMappedOrders);

//   //   const result = await handler.execute();

//   //   expect(cacheService.get).toHaveBeenCalledWith(ORDER_CACHE_KEYS.FIND_ALL);
//   //   expect(result).toEqual(mockMappedOrders);
//   //   expect(findAllOrderService.execute).not.toHaveBeenCalled();
//   // });

//   // it('should fetch from service and cache if cache is empty', async () => {
//   //   (cacheService.get as jest.Mock).mockResolvedValue(null);
//   //   (findAllOrderService.execute as jest.Mock).mockResolvedValue(mockOrders);

//   //   const result = await handler.execute();

//   //   expect(cacheService.get).toHaveBeenCalledWith(ORDER_CACHE_KEYS.FIND_ALL);
//   //   expect(findAllOrderService.execute).toHaveBeenCalled();
//   //   expect(cacheService.set).toHaveBeenCalledWith(
//   //     ORDER_CACHE_KEYS.FIND_ALL,
//   //     mockMappedOrders,
//   //     60,
//   //   );
//   //   expect(result).toEqual(mockMappedOrders);
//   // });

//   // it('should throw an error if cacheService.get throws', async () => {
//   //   (cacheService.get as jest.Mock).mockRejectedValue(new Error('Cache error'));

//   //   await expect(handler.execute()).rejects.toThrow('Cache error');
//   // });
// });
