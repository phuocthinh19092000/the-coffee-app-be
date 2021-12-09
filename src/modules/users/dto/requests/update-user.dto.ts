import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsNumber()
  freeUnit: number;
}
