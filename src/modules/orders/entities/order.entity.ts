import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Product } from '../../products/entities/product.entity';
import { OrderStatus } from '../constants/order.constant';
import { BaseEntity } from '../../shared/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order extends BaseEntity {
  @Prop({ required: true })
  @ApiProperty()
  quantity: number;

  @Prop()
  @ApiProperty()
  note: string;

  @Prop({ required: true, default: OrderStatus.new })
  @ApiProperty()
  orderStatus: OrderStatus;

  @Prop()
  @ApiProperty()
  quantityBilled: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  @ApiProperty()
  productId: Product;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
