import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/common/config/config.module';
import { EventGateway } from './gateways/event.gateway';

@Module({
  imports: [AppConfigModule],
  providers: [EventGateway],
  exports: [EventGateway],
})
export class EventModule {}
