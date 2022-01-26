import { Module } from '@nestjs/common';
import { EventGateway } from './gateways/event.gateway';

@Module({
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
