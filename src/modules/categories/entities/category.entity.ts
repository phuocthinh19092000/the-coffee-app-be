import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category extends Document {

  @Prop({ require: true, unique: true })
  @ApiProperty()
  name: string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);
