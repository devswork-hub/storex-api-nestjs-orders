import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlCtx = GqlExecutionContext.create(context);
    const info = gqlCtx.getInfo();
    const ctx = gqlCtx.getContext();

    // info.fieldName: nome da query ou mutation
    // ctx.req: pode ter a requisição HTTP original (depende da configuração do GraphQLModule)

    const operationName = info.fieldName;
    const operationType = info.operation.operation; // query, mutation, subscription

    console.log(
      `GraphQL ${operationType.toUpperCase()} ${operationName} requested`,
    );

    return next.handle().pipe(
      tap(() => {
        console.log(
          `GraphQL ${operationType.toUpperCase()} ${operationName} resolved`,
        );
      }),
    );
  }
}

// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';

// import { tap } from 'rxjs/operators';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler<unknown>) {
//     const date = new Date().toISOString();
//     const { fieldName } = context.getArgs()[3] ?? { fieldName: 'REST API' };
//     const message = `${date} Request-Response time of ${fieldName}`;
//     console.time(message);
//     return next.handle().pipe(tap(() => console.timeEnd(message)));
//   }
// }
