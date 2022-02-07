import { Module } from '@nestjs/common';
import { OrderEventGateway } from './gateways/order-event.gateway';

@Module({
  providers: [OrderEventGateway],
  exports: [OrderEventGateway],
})
export class OrderEventModule {}
