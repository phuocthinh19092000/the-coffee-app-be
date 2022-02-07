import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { OrderStatusNumber } from '../../constants/order.constant';

export class UpdateStatusOrderDto {
  @IsNumber()
  @ApiProperty({
    description: 'Order status number',
    enum: OrderStatusNumber,
    example: [
      OrderStatusNumber.new,
      OrderStatusNumber.processing,
      OrderStatusNumber.ready,
      OrderStatusNumber.canceled,
    ],
  })
  @IsEnum(OrderStatusNumber)
  status: number;

  @ApiProperty()
  @IsString()
  userId: string;
}
