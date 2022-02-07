import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderStatusNumber } from '../../constants/order.constant';

export class UpdateStatusOrderDto {
  @IsNumber()
  @ApiProperty()
  @IsEnum(OrderStatusNumber)
  status: number;

  @ApiProperty()
  @IsString()
  userId: string;
}
