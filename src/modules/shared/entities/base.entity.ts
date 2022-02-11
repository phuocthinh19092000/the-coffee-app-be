import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export class BaseEntity extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  @ApiProperty()
  user: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  @ApiProperty()
  updateBy: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  @ApiProperty()
  deletedBy: mongoose.Schema.Types.ObjectId;
}
