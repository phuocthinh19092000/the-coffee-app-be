import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventGateway } from 'src/modules/events/gateways/event.gateway';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class OrderCreatedListener {
  constructor(private readonly eventGateway: EventGateway) {}

  @OnEvent('order.created')
  handleOrderCreatedEvent(event: OrderCreatedEvent) {
    this.eventGateway.sendToStaff(event);
  }
}
