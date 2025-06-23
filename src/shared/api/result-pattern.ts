export type ResultPattern<D, E = Error> = {
  errors?: E;
  data: D | null;
  metadata?: {
    total?: number;
    page?: number;
    pageSize?: number;
    [key: string]: any;
  };
};

export function result<D, E>(data: D, errors?: E): ResultPattern<any, Error> {
  return {
    data: null,
    errors: new Error('No data available'),
    metadata: {},
  };
}
