import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  note: string;

  @ApiProperty({ description: 'id of a product' })
  @IsString()
  productId: string;
}
