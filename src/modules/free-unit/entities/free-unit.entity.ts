import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import toJson from 'src/database/plugins/toJson';
import { Document } from 'mongoose';
@Schema()
export class FreeUnit extends Document {
  @Prop()
  quantity: number;
}
export const FreeUnitSchema = SchemaFactory.createForClass(FreeUnit);
FreeUnitSchema.plugin(toJson);
