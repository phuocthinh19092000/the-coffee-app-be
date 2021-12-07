import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Product } from '../../products/entities/product.entity';
import * as mongoose from 'mongoose';
export type CategoryDocument = Category & Document;

@Schema()
export class Category extends Document {
  @Prop({ require: true, unique: true })
  @ApiProperty()
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  })
  products: Product[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
