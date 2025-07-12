export type OutboxContract<Model> = {
  id?: string; // (UUID): unique event identifier
  /**
   * (VARCHAR(255)): the type of domain object described by an event, e.g. “appointment”; used for routing outbox events of different types to different Kafka topics
   */
  aggregateType: string; // Tipo da entidade que gerou o evento (ex: 'Order')

  /**
   * (VARCHAR(255)): the id of the represented domain object, e.g. the appointment id; used as message key to ensure correct event ordering with partitioned Kafka topics
   */
  aggregateId: string; // ID da entidade que gerou o evento (ex: ID do pedido)

  /**
   * (VARCHAR(255)): The type of event, e.g. “appointment created”; can be used by consumers to trigger specific event handlers
   */
  eventType: string; // Tipo do evento (ex: 'OrderCreated', 'OrderUpdated')

  /**
   * (JSONB): The actual event payload
   */
  payload: Record<string, Model>; // Dados do evento

  processed: boolean; // Indica se a mensagem foi processada e enviada

  processedAt: Date; // Data/hora do processamento
  retryCount?: number;
};
