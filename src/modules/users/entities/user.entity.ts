import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from '../../roles/entities/role.entity';
import validator from 'validator';
import { UserStatus } from '../constants/user.constant';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, private: true })
  password: string;

  @Prop()
  name: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      message: 'Email is not valid',
      validator: (value) => validator.isEmail(value),
    },
  })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true, default: 3 })
  freeUnit: number;

  @Prop()
  avatarUrl: string;

  @Prop({ required: true, default: UserStatus.activate })
  available: UserStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;
}

export const CoffeeSchema = SchemaFactory.createForClass(User);
