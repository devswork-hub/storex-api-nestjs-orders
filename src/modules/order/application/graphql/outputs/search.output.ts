import { createUnionType, Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderOuput } from './order.output';

@ObjectType()
export class OffsetPaginatedOrderResult {
  @Field(() => String)
  type: 'offset';

  @Field(() => [OrderOuput])
  items: OrderOuput[];

  @Field()
  total: number;

  @Field()
  currentPage: number;

  @Field()
  perPage: number;

  @Field()
  lastPage: number;
}

@ObjectType()
export class CursorPaginatedOrderResult {
  @Field(() => String)
  type: 'cursor';

  @Field(() => [OrderOuput])
  items: OrderOuput[];

  @Field()
  total: number;

  @Field()
  hasNextPage: boolean;

  @Field({ nullable: true })
  nextCursor: string | null;
}
const types = {
  offset: OffsetPaginatedOrderResult,
  cursor: CursorPaginatedOrderResult,
};

export const PaginatedOrderResult = createUnionType({
  name: 'PaginatedOrderResult',
  types: () =>
    [OffsetPaginatedOrderResult, CursorPaginatedOrderResult] as const,
  resolveType(value) {
    // Aqui usamos a propriedade "type" como discriminador
    const type = value?.type;
    return types[type] || null;
  },
});
