import { Injectable, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { EventGateway } from 'src/modules/events/gateways/event.gateway';
import { OrderCreatedEvent } from '../events/order-created.event';
import { OrdersService } from '../services/orders.service';
@Injectable()
@UseGuards(JwtAuthGuard)
export class OrderCreatedListener {
  constructor(
    private readonly eventGateway: EventGateway,
    private readonly ordersService: OrdersService,
  ) {}

  @OnEvent('order.created')
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    this.eventGateway.sendToStaff(event);
  }
}
