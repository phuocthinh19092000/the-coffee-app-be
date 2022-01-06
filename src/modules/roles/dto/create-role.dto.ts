import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoleType } from '../constants/role.constant';
export class CreateRoleDto {
  @ApiProperty()
  @IsEnum(RoleType)
  name: string;
}
