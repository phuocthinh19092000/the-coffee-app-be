import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from '../../categories/entities/category.entity';
import { BaseEntity } from '../../shared/entities/base.entity';
import { ProductStatus } from '../constants/product.constant';
@Schema()
export class Product extends BaseEntity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop({ required: true, default: ProductStatus.inStock })
  status: ProductStatus;

  @Prop()
  avatarUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    require: true,
  })
  category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
