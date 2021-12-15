import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import validator from 'validator';
import { UserStatus } from '../constants/user.constant';
import * as bcrypt from 'bcrypt';
export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty()
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

  @ApiProperty({ default: 3 })
  @Prop({ required: true, default: 3 })
  freeUnit: number;

  @Prop()
  avatarUrl: string;

  @Prop({ required: true, default: UserStatus.active })
  available: UserStatus;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  // role: Role;
}
const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.set('password', await bcrypt.hash(this.password, 8));
  }
});

export default UserSchema;
UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.id = _id;
  return object;
});
