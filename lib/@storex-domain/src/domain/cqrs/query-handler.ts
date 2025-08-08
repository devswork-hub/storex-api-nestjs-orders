/**
 * QueryHandler interface for handling queries in a CQRS architecture.
 * It defines a method to execute a query and return a result.
 * The result can be synchronous or asynchronous, and can return null if no result is found.
 * @template Query - The type of the query to be executed.
 * @template Result - The type of the result returned by the query.
 * @interface QueryHandler
 * @property {function} execute - A method that takes a query and returns a result.
 */
export type QueryHandler<Query, Result> = {
  readonly execute: (query: Query) => Result | Promise<Result | null> | null;
};

// TODO: validate if this is needed
export type QueryHandlerWithPagination<Query, Result> = {
  readonly execute: (query: Query) => Result | Promise<Result | null> | null;
};

// TODO: validate if this is needed
export type QueryHandlerWithPaginationAndCount<Query, Result> = {
  readonly execute: (
    query: Query,
  ) =>
    | { data: Result; count: number }
    | Promise<{ data: Result; count: number } | null>
    | null;
};
