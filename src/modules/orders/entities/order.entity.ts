import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Product } from '../../products/entities/product.entity';
import { BaseEntity } from '../../shared/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import toJson from 'src/database/plugins/toJson';
import { Status } from 'src/modules/status/entities/status.entity';

@Schema({
  timestamps: true,
})
export class Order extends BaseEntity {
  @Prop({ required: true })
  @ApiProperty()
  quantity: number;

  @Prop()
  @ApiProperty()
  note: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
    required: true,
  })
  @ApiProperty()
  orderStatus: Status;

  @Prop()
  @ApiProperty()
  quantityBilled: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  @ApiProperty()
  product: Product;

  @Prop({
    type: mongoose.Schema.Types.Date,
  })
  createdAt: Date;

  @Prop({ default: '' })
  @ApiProperty()
  reason: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.plugin(toJson);
