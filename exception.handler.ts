// import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
// import { GqlExceptionFilter } from '@nestjs/graphql';
// import { RepositoryException } from './src/modules/order/shared/exceptions/repository.exception';

// @Catch()
// export class GraphQLExceptionFilter implements GqlExceptionFilter {
//   private readonly logger = new Logger(GraphQLExceptionFilter.name);

//   catch(exception: unknown, host: ArgumentsHost) {
//     // Log básico pra rastrear (pode customizar depois)
//     this.logger.error('GraphQL Exception', exception as any);

//     if (exception instanceof RepositoryException) {
//       return new S('Erro no repositório', 'REPOSITORY_EXCEPTION', {
//         origin: exception.origin,
//         details: exception.message,
//       });
//     }

//     if (exception instanceof DomainException) {
//       return new ApolloError('Erro de domínio', 'DOMAIN_EXCEPTION', {
//         field: exception.field,
//         message: exception.message,
//       });
//     }

//     // Tratamento de erros do Mongoose
//     if ((exception as any).name === 'MongoError') {
//       return new ApolloError('Erro no banco de dados', 'MONGO_ERROR');
//     }

//     if ((exception as any).name === 'ValidationError') {
//       return new ApolloError('Erro de validação', 'VALIDATION_ERROR', {
//         errors: (exception as any).errors,
//       });
//     }

//     // Erro genérico (fallback)
//     return new ApolloError('Erro interno no servidor', 'INTERNAL_SERVER_ERROR');
//   }
// }
