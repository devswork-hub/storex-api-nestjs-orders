import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

/**
 * Schema hibrido, que funciona da mesma forma para o Mongoose, quanto para o GraphQL
 */
@Schema()
@ObjectType(CurrencyHybridSchema.name, {
  description: 'Representa a moeda atual do pedido',
})
export class CurrencyHybridSchema {
  @Prop({ required: true })
  @Field(() => String)
  currency: string;
}
