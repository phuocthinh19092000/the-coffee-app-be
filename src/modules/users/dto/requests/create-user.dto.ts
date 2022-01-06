import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { RoleType } from 'src/modules/roles/constants/role.constant';
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  avatarUrl: string;

  @IsString()
  @ApiProperty()
  @IsEnum(RoleType)
  roleName: string;
}
