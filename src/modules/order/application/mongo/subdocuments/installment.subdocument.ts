import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class InstallmentSubdocument {
  @Prop() number: number;
  @Prop() value: number;
  @Prop() interestRate?: number;
  @Prop() totalValue?: number;
  @Prop() dueDate?: string;
}

export const InstallmentSchema = SchemaFactory.createForClass(
  InstallmentSubdocument,
);
