import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CustomerSnapshotSubdocument {
  @Prop() name: string;
  @Prop() email: string;
}

export const CustomerSnapshotSchemaSchema = SchemaFactory.createForClass(
  CustomerSnapshotSubdocument,
);
