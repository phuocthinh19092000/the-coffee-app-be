import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductStatus } from '../constants/product.constant';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';

@Schema()
export class Product extends Document {
  @Prop({ required: true, unique: true })
  @ApiProperty()
  name: string;

  @Prop({ required: true })
  @ApiProperty()
  price: number;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop({ required: true, default: ProductStatus.inStock })
  @ApiProperty({ enum: ProductStatus })
  status: ProductStatus;

  @Prop({ default: '' })
  @ApiProperty()
  images: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  @ApiProperty()
  category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
