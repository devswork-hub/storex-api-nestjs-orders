import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { performance } from 'perf_hooks';
import { PrometheusService } from '../integrations/prometheus/prometheus.service';

@Injectable()
export class GraphqlMetricsInterceptor implements NestInterceptor {
  constructor(private readonly prometheus: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Verifica se o contexto atual é GraphQL
    const isGraphql = context.getType<'graphql'>() === 'graphql';

    if (!isGraphql) {
      // Ignora contextos REST, WS, etc.
      return next.handle();
    }

    const gqlCtx = GqlExecutionContext.create(context);
    const info = gqlCtx.getInfo();

    // Proteção extra — info pode ser undefined em resolvers de campos
    const operation = info?.operation?.operation ?? 'unknown';
    const fieldName = info?.fieldName ?? 'unknown';

    const start = performance.now();

    return next.handle().pipe(
      tap(() => {
        const duration = (performance.now() - start) / 1000;
        this.prometheus.incrementOperation(
          `${operation}:${fieldName}`,
          'success',
        );
        this.prometheus.observeDuration(
          `${operation}:${fieldName}`,
          'success',
          duration,
        );
      }),
      catchError((err) => {
        const duration = (performance.now() - start) / 1000;
        this.prometheus.incrementOperation(
          `${operation}:${fieldName}`,
          'error',
        );
        this.prometheus.observeDuration(
          `${operation}:${fieldName}`,
          'error',
          duration,
        );
        return throwError(() => err);
      }),
    );
  }
}
