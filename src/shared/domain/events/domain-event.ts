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
