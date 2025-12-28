// idempotency.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 🔹 Verifica se a mutation exige idempotência
    const isIdempotent = this.reflector.get<boolean>(
      'IDEMPOTENT_MUTATION',
      context.getHandler(),
    );

    if (!isIdempotent) return true;

    // 🔹 Contexto GraphQL
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext();

    const idempotencyKey =
      req.headers['idempotency-key'] || req.headers['Idempotency-Key'];

    if (!idempotencyKey) {
      throw new BadRequestException(
        'Idempotency-Key header is required for this mutation',
      );
    }

    return true;
  }
}
