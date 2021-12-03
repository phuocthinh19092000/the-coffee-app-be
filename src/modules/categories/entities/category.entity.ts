import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category extends Document {
  @Prop({ require: true, unique: true })
  name: string;
}

export const CoffeeSchema = SchemaFactory.createForClass(Category);
