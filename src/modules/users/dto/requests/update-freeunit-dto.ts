import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateFreeUnitDto {
  @ApiProperty()
  @IsNumber()
  freeUnit: number;
}
