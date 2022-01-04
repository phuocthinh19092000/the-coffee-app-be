import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @ApiHideProperty()
  quantity: number;

  @IsOptional()
  @ApiHideProperty()
  note: string;

  @IsOptional()
  @ApiProperty()
  status: string;
}
