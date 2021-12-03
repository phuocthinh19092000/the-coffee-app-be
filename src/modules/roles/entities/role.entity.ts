import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { RoleType } from '../constants/role.constant';

export type RoleDocument = Role & Document;

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true, enum: RoleType })
  name: RoleType;
}

export const CoffeeSchema = SchemaFactory.createForClass(Role);
