export interface DomainEventType {
  readonly eventId: string; // Identificador unico do evento
  readonly eventType: string; // Tipo do evento (ex.: "OrderCreated")
  readonly aggregateId: string; // ID do agregado e/ou entitidade que originou o evento
  readonly occurredOn: Date;
  readonly eventVersion?: string; // Numero da versao do evento, para controle futuro
  readonly payload?: any;
}
