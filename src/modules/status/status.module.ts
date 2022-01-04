import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatusController } from './controllers/status.controller';
import { Status, StatusSchema } from './entities/status.entity';
import { StatusService } from './services/status.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Status.name,
        schema: StatusSchema,
      },
    ]),
  ],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
