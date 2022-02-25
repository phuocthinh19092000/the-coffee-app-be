import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import validator from 'validator';
import { UserStatus } from '../constants/user.constant';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/modules/roles/entities/role.entity';
export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    validate: {
      message: 'Email is not valid',
      validator: (value) => validator.isEmail(value),
    },
  })
  email: string;

  @ApiProperty()
  @Prop({ required: true, private: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @ApiProperty({ default: 3 })
  @Prop({ required: true, default: 3 })
  freeUnit: number;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ required: true, default: UserStatus.ACTIVE })
  available: UserStatus;

  @Prop()
  deviceToken: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop()
  webHook: string;
}
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.set('password', await bcrypt.hash(this.password, 8));
  }
});

UserSchema.method('toJSON', function () {
  const userObject = this.toObject();
  userObject.id = userObject._id;

  delete userObject.password;
  delete userObject._id;
  delete userObject.__v;
  delete userObject.deviceToken;
  delete userObject.webHook;

  return userObject;
});

export default UserSchema;
