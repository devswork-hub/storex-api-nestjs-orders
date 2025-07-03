// describe('GetOrderUseCase', () => {
//   let useCase: GetOrderUseCase;
//   let repo: OrderInMemoryRepository;

//   beforeEach(() => {
//     repo = new OrderInMemoryRepository();
//     useCase = new GetOrderUseCase(repo);
//   });

//   it('deve buscar pedido pelo id', async () => {
//     await repo.createOne({ id: '1', ... });
//     const order = await useCase.execute('1');
//     expect(order).toBeDefined();
//     expect(order.id).toBe('1');
//   });
// });

// describe('GetOrderHandler', () => {
//   let handler: GetOrderHandler;
//   let useCase: GetOrderUseCase;

//   beforeEach(() => {
//     useCase = {
//       execute: jest.fn(),
//     } as any;

//     handler = new GetOrderHandler(useCase);
//   });

//   it('deve chamar o use case e retornar resultado', async () => {
//     const query = new GetOrderQuery('1');
//     const expectedOrder = { id: '1', ... };
//     (useCase.execute as jest.Mock).mockResolvedValue(expectedOrder);

//     const result = await handler.execute(query);

//     expect(useCase.execute).toHaveBeenCalledWith('1');
//     expect(result).toBe(expectedOrder);
//   });
// });

// describe('OrdersResolver', () => {
//   let resolver: OrdersResolver;
//   let queryBus: QueryBus;

//   beforeEach(() => {
//     queryBus = { execute: jest.fn() } as any;
//     resolver = new OrdersResolver(queryBus);
//   });

//   it('deve chamar queryBus.execute', async () => {
//     const expectedOrder = { id: '1' };
//     (queryBus.execute as jest.Mock).mockResolvedValue(expectedOrder);

//     const result = await resolver.order('1');

//     expect(queryBus.execute).toHaveBeenCalledWith(new GetOrderQuery('1'));
//     expect(result).toBe(expectedOrder);
//   });
// });
