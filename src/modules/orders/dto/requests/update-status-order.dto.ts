import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateStatusOrderDto {
  @IsNumber()
  @ApiProperty()
  status: number;
}
