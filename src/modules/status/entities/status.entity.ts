import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import toJson from 'src/database/plugins/toJson';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Order } from 'src/modules/orders/entities/order.entity';
export type StatusDocument = Status & Document;

@Schema()
export class Status extends Document {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: true })
  value: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  })
  orders: Order[];
}

export const StatusSchema = SchemaFactory.createForClass(Status);

StatusSchema.plugin(toJson);
