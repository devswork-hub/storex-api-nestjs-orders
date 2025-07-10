export type OutboxContract<Model> = {
  aggregateType: string; // Tipo da entidade que gerou o evento (ex: 'Order')
  aggregateId: string; // ID da entidade que gerou o evento (ex: ID do pedido)
  eventType: string; // Tipo do evento (ex: 'OrderCreated', 'OrderUpdated')
  payload: Record<string, Model>; // Dados do evento
  processed: boolean; // Indica se a mensagem foi processada e enviada
  processedAt: Date; // Data/hora do processamento
};
