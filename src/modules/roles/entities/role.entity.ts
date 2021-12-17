import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleType } from '../constants/role.constant';

export type RoleDocument = Role & Document;

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true, enum: RoleType })
  name: RoleType;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
