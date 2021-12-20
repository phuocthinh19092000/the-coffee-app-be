import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PushNotificationDto } from '../dto/requests/push-notification-dto.dto';
import { NotificationsService } from '../services/notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Send notification to single device' })
  @ApiOkResponse({
    description: 'Send notification successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid device token',
  })
  @Post()
  async sendNotification(
    @Body() pushNotificationDto: PushNotificationDto,
    @Res() res,
  ) {
    const response = await this.notificationsService.sendNotification(
      pushNotificationDto,
    );

    if (response.failureCount > 0) {
      throw new BadRequestException({
        description: 'Invalid device Token',
        status: 400,
      });
    }
    res.status(200).send(response);
  }
}
