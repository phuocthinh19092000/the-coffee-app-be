import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import toJson from 'src/database/plugins/toJson';
import { RoleType } from '../constants/role.constant';

export type RoleDocument = Role & Document;

@Schema()
export class Role extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true, enum: RoleType })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.plugin(toJson);
