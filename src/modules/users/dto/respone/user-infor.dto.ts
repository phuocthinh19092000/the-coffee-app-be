import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import * as mongoose from 'mongoose';
import { UserStatus } from '../../constants/user.constant';
export class UserInforDto {
  @ApiProperty()
  id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  freeUnit: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  avatarUrl: string;

  @ApiProperty()
  available: UserStatus;
}
