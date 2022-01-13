import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class FreeUnitDto {
  @ApiProperty()
  @IsPositive()
  quantity: number;
}
