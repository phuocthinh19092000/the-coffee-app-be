import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { OrderStatus } from '../constants/order.constant';
import { BaseEntity } from '../../shared/entities/base.entity';
export type OrderDocument = Order & Document;

@Schema()
export class Order extends BaseEntity {
  @Prop({ required: true })
  quantity: number;

  @Prop()
  note: string;

  @Prop({ required: true, default: OrderStatus.new })
  orderStatus: OrderStatus;

  @Prop()
  quantityBilled: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true })
  product: Product;
}

export const CoffeeSchema = SchemaFactory.createForClass(Order);
