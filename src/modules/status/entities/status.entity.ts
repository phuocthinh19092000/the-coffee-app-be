import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import toJson from 'src/database/plugins/toJson';
import { Document } from 'mongoose';
export type StatusDocument = Status & Document;

@Schema()
export class Status extends Document {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: true })
  value: number;
}

export const StatusSchema = SchemaFactory.createForClass(Status);

StatusSchema.plugin(toJson);
