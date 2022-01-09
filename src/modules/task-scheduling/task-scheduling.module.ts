import { Module } from '@nestjs/common';
import { FreeUnitModule } from '../free-unit/free-unit.module';
import { UsersModule } from '../users/users.module';
import { TaskSchedulingController } from './controllers/task-scheduling.controller';
import { TaskSchedulingService } from './services/task-scheduling.service';

@Module({
  imports: [FreeUnitModule, UsersModule],
  controllers: [TaskSchedulingController],
  providers: [TaskSchedulingService],
  exports: [TaskSchedulingService],
})
export class TaskSchedulingModule {}
