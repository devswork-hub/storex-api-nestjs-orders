// TODO: ajustar todo o codigo

import { RepositoryException } from './repository.exception';

export function exceptionHandler(error: Error): {
  statusCode: number;
  message: string;
} {
  if (error instanceof RepositoryException) {
    return {
      statusCode: 400,
      message: error.message || 'Repository Error',
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      message: error.message || 'Internal Server Error',
    };
  }

  return {
    statusCode: 500,
    message: 'An unexpected error occurred',
  };
}
