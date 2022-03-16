import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @ApiProperty()
  quantity: number;

  @IsOptional()
  @ApiProperty()
  note: string;

  @IsOptional()
  @ApiProperty()
  status: number;
}
