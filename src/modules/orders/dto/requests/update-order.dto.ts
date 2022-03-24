import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { OrderStatusNumber } from '../../constants/order.constant';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  quantity: number;

  @IsOptional()
  @ApiProperty()
  note: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum(OrderStatusNumber)
  status: number;
}
