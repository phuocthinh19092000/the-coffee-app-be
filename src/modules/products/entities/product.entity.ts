import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductStatus } from '../constants/product.constant';
import { ApiProperty } from '@nestjs/swagger';
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
  avatarUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
