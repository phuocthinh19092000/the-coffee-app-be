import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { OrderEventGateway } from './gateways/order-event.gateway';

@Module({
  imports: [UsersModule],
  providers: [OrderEventGateway],
  exports: [OrderEventGateway],
})
export class OrderEventModule {}
