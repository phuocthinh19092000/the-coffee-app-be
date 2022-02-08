import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
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
  @IsNumber()
  status: number;
}
