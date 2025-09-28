// import { Test, TestingModule } from '@nestjs/testing';
// import { FindAllOrdersHandler } from './find-all-orders.handler';
// import { FindAllOrderService } from '@/modules/order/domain/usecases/find-all-order.service';
// import { CacheService } from '@/app/persistence/cache/cache.service';
// import { CustomCacheModule } from '@/app/persistence/cache/cache.module';
// import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';

// describe('FindAllOrdersHandler - Integration', () => {
//   let handler: FindAllOrdersHandler;
//   let cacheService: CacheService;
//   let findAllOrdersService: FindAllOrderService;

//   beforeAll(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [CustomCacheModule.forRoot({ isGlobal: true })],
//       providers: [FindAllOrdersHandler, FindAllOrderService, CacheService],
//     }).compile();

//     handler = module.get<FindAllOrdersHandler>(FindAllOrdersHandler);
//     cacheService = module.get<CacheService>(CacheService);
//     findAllOrdersService = module.get<FindAllOrderService>(FindAllOrderService);
//   });

//   it('should be defined', () => {
//     expect(handler).toBeDefined();
//   });

//   it('should fetch from service and cache the result', async () => {
//     // Limpa cache antes do teste
//     await cacheService.set(ORDER_CACHE_KEYS.FIND_ALL, null);

//     // Executa handler
//     const result = await handler.execute();

//     // Busca do cache
//     const cached = await cacheService.get(ORDER_CACHE_KEYS.FIND_ALL);

//     expect(result).toEqual(cached); // Resultado deve ser igual ao que está em cache
//     expect(Array.isArray(result)).toBe(true); // Deve retornar array
//   });

//   it('should return cached result if available', async () => {
//     // Pré-popula cache
//     const cachedValue = [{ id: 999, product: 'Cached Product' }];
//     await cacheService.set(ORDER_CACHE_KEYS.FIND_ALL, cachedValue);

//     const result = await handler.execute();

//     expect(result).toEqual(cachedValue); // Deve vir do cache
//   });
// });
