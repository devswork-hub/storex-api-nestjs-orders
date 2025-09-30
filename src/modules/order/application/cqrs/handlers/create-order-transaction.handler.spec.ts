// import { CreateOrderCommand } from './create-order-transaction.command';

// // Assumindo a configuração de mocks e spies
// describe('CreateOrderTransactionCommandHandler', () => {
//   // ... setup de instâncias e mocks ...

//   it('deve executar a transação, publicar no outbox e no event bus com sucesso', async () => {
//     // 1. Arrange (Preparação)
//     const mockOrder = {
//       /* objeto de pedido mockado */
//     };
//     const domainEvents = [
//       {
//         /* Evento de Domínio mockado */
//       },
//     ];
//     const command = new CreateOrderCommand({
//       /* dados de input válidos */
//     });

//     // Mock do CreateOrderService
//     mockCreateOrderService.execute.mockResolvedValue({
//       order: mockOrder,
//       events: domainEvents,
//     });

//     // Mock da UoW para simular a transação
//     // O mock simula o que a função `startTransaction` faria:
//     // chama o callback e retorna o resultado que o callback produz.
//     mockUow.startTransaction.mockImplementation(async (callback) => {
//       const result = await callback({}); // Passa um manager mock (vazio, se não for usado)
//       return result;
//     });

//     // 2. Act (Ação)
//     const result = await handler.execute(command);

//     // 3. Assert (Verificação)

//     // Verifica chamadas
//     expect(mockUow.startTransaction).toHaveBeenCalledTimes(1);
//     expect(mockOrderRepository.setTransactionManager).toHaveBeenCalledTimes(1);
//     expect(mockCreateOrderService.execute).toHaveBeenCalledWith(
//       expect.objectContaining({
//         /* validar input de domínio */
//       }),
//     );

//     // Verifica a publicação no Outbox (antes do commit da transação)
//     expect(mockDomainPublisher.publishAll).toHaveBeenCalledWith(
//       domainEvents,
//       expect.any(Object), // Verifica que o manager da transação foi passado
//     );

//     // Verifica a publicação no EventBus (após o commit da transação)
//     expect(mockEventBus.publish).toHaveBeenCalledWith(
//       expect.any(OrderCreatedEvent),
//     );

//     // Verifica o retorno
//     expect(result).toEqual(
//       expect.objectContaining({
//         /* output GraphQL esperado */
//       }),
//     );
//   });

//   it('deve lançar erro se a validação falhar', async () => {
//     // Mockar a validação para lançar um erro
//     jest
//       .spyOn(CreateOrderValidation.prototype, 'validate')
//       .mockImplementation(() => {
//         throw new Error('Validation Failed');
//       });

//     const command = new CreateOrderCommand({
//       /* dados de input inválidos */
//     });

//     // Espera que o `execute` lance o erro
//     await expect(handler.execute(command)).rejects.toThrow('Validation Failed');

//     // Garante que a transação NÃO foi iniciada
//     expect(mockUow.startTransaction).not.toHaveBeenCalled();
//   });
// });
