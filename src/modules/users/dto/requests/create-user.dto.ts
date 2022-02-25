import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { RoleType } from 'src/modules/roles/constants/role.constant';
import { UserStatus } from '../../constants/user.constant';
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  avatarUrl: string;

  @IsString()
  @ApiProperty({
    description: 'Role of the user',
    enum: RoleType,
    example: [RoleType.ADMIN, RoleType.CUSTOMER, RoleType.VENDOR],
  })
  @IsEnum(RoleType)
  roleName: string;

  @IsEnum(UserStatus)
  @IsOptional()
  @ApiProperty()
  avaialble: string;
}
