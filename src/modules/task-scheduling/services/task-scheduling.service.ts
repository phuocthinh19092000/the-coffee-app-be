import { Injectable } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { FreeUnitService } from 'src/modules/free-unit/services/free-unit.service';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class TaskSchedulingService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly freeUnitService: FreeUnitService,
    private readonly usersService: UsersService,
  ) {}

  getCronJob(name: string): CronJob | null {
    try {
      const job = this.schedulerRegistry.getCronJob(name);
      return job;
    } catch {
      return null;
    }
  }

  getAllCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    return jobs;
  }

  addCronJob(
    name: string,
    time: string | CronExpression,
    callback: () => void,
  ) {
    const job = new CronJob(time, callback);
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  stopCronJob(name: string) {
    const job = this.getCronJob(name);
    job.stop();
  }

  async task(): Promise<void> {
    const freeUnit = await this.freeUnitService.get();
    if (freeUnit) {
      const newFreeUnit = { freeUnit: freeUnit.quantity };
      this.usersService.updateAllFreeUnit(newFreeUnit);
    }
  }
}
