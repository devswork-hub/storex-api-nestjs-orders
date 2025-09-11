import { Field, ObjectType } from '@nestjs/graphql';
import { CustomerSnapshot } from '../../../domain/order.constants';

@ObjectType({ description: 'Representa uma composição do Order' })
export class CustomerSnapshotOutput implements CustomerSnapshot {
  @Field() name: string;
  @Field() email: string;
}
