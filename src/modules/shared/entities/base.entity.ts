import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';
export class BaseEntity extends Document {
  @Prop({ type: mongoose.Schema.Types.Date, default: Date.now() })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Date })
  deletedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  createdBy: mongoose.Schema.Types.ObjectId | User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  updatedBy: mongoose.Schema.Types.ObjectId | User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  deletedBy: mongoose.Schema.Types.ObjectId | User;
}
