export enum CDCOperation {
  READ = 'r',
  CREATE = 'c',
  UPDATE = 'u',
  DELETE = 'd',
}

export class CDCPayloadDto<T = any> {
  op: CDCOperation;
  after: T | null;
  before: T | null;
}
