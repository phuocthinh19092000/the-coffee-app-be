import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskSchedulingService } from '../services/task-scheduling.service';
@Controller('taskscheduling')
@ApiTags('taskscheduling')
export class TaskSchedulingController {
  constructor(private readonly taskSchedulingService: TaskSchedulingService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'cronjob',
  })
  runCronJob() {
    this.taskSchedulingService.task();
  }

  @Get('/cronjob')
  @ApiOperation({ summary: 'Get all Cron Jobs' })
  getAllCronJobs() {
    const jobs = this.taskSchedulingService.getAllCronJobs();
    const result = [];
    jobs.forEach((value, key) => {
      result.push({ [key]: value.running });
    });
    return result;
  }

  @Post('/cronjob')
  @ApiOperation({ summary: 'Add Cron job' })
  addCronJob() {
    const callback = async () => await this.taskSchedulingService.task();
    const job = this.taskSchedulingService.getCronJob('cronjob');
    if (job) {
      if (job.running) throw new BadRequestException();
      job.start();
    } else {
      this.taskSchedulingService.addCronJob(
        'cronjob',
        CronExpression.EVERY_DAY_AT_MIDNIGHT,
        callback,
      );
    }
  }

  @Delete('/cronjob')
  @ApiOperation({ summary: 'Stop Cron job' })
  deleteCronJob() {
    if (this.taskSchedulingService.getCronJob('cronjob')) {
      this.taskSchedulingService.stopCronJob('cronjob');
      Logger.log('Stop con job');
    }
  }
}
