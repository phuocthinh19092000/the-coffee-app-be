import { Prop } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { OrderStatus } from '../../constants/order.constant';

export class UpdateOrderDto {
  @IsOptional()
  @ApiHideProperty()
  quantity: number;

  @IsOptional()
  @ApiHideProperty()
  note: string;

  @IsOptional()
  @ApiProperty({ default: '' })
  orderStatus: OrderStatus;
}
