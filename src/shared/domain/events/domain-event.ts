export type DomainEventContract = {
  version: {
    prefix: string;
    minor: number;
    major: number;
  };
  metadata: {
    name: string;
    description: string;
  };
};

export interface DomainEventType {
  aggregateId: string;
  occurredOn: string;
  eventVersion: string;
}
