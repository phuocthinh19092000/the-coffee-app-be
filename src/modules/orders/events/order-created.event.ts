import { PartialType } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';

export class OrderCreatedEvent extends PartialType(Order) {}
