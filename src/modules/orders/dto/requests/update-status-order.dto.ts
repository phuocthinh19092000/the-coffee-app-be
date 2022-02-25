import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { OrderStatusNumber } from '../../constants/order.constant';

export class UpdateStatusOrderDto {
  @IsNumber()
  @ApiProperty({
    description: 'Order status number',
    enum: OrderStatusNumber,
    example: [
      OrderStatusNumber.NEW,
      OrderStatusNumber.PROCESSING,
      OrderStatusNumber.READY,
      OrderStatusNumber.CANCELED,
    ],
  })
  @IsNumber()
  status: number;
}
