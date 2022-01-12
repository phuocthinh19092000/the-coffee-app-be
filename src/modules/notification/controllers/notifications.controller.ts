import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
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
import { PushNotificationGoogleChatDto } from '../dto/requests/push-notification-google-chat.dto';
import { NotificationsService } from '../services/notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Send notification' })
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
    try {
      const response = await this.notificationsService.sendNotification(
        pushNotificationDto,
      );

      if (response.failureCount) {
        throw new Error(`${response.results[0].error}`);
      }
      res.status(200).send(response);
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException({
        statusCode: 500,
        message: err.message,
      });
    }
  }

  @ApiOperation({ summary: 'Send notification to google chat' })
  @ApiOkResponse({
    description: 'Send notification  to google chat successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid web hook link',
  })
  @Post('/google-chat')
  async sendNotificationToGoogleChat(
    @Body() pushNotificationGoogleChatDto: PushNotificationGoogleChatDto,
    @Res() res,
  ) {
    const badRequestCode = 400;
    try {
      const axiosResponse =
        await this.notificationsService.sendNotificationToGoogleChat(
          pushNotificationGoogleChatDto,
        );

      if (axiosResponse.status === badRequestCode) {
        throw new Error(`${axiosResponse.statusText}`);
      }

      res.status(200).send(axiosResponse.data);
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: err.message,
      });
    }
  }
}
