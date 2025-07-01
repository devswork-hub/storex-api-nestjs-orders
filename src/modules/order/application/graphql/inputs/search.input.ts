import { SortDirectionEnum } from '@/src/shared/persistence/search-params';
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

registerEnumType(SortDirectionEnum, { name: 'SortDirection' });

@InputType()
export class OffsetPaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true })
  limit?: number;
}

@InputType()
export class CursorPaginationInput {
  @Field({ nullable: true })
  after?: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;
}

@InputType()
export class OrderSortInput {
  @Field()
  field: string;

  @Field(() => SortDirectionEnum)
  direction: SortDirectionEnum;
}

@InputType()
export class OrderFilterInput {
  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  customerId?: string;

  // Adicione mais campos conforme necessário
}

@InputType()
export class PaginationInput {
  @Field(() => String)
  type: 'offset' | 'cursor';

  @Field(() => OffsetPaginationInput, { nullable: true })
  offset?: OffsetPaginationInput;

  @Field(() => CursorPaginationInput, { nullable: true })
  cursor?: CursorPaginationInput;
}
