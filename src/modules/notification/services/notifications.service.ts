import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import {
  MessagingDevicesResponse,
  MessagingPayload,
} from 'firebase-admin/lib/messaging/messaging-api';
import { AppConfigService } from 'src/common/config/config.service';
import { PushNotificationDto } from '../dto/requests/push-notification-dto.dto';
@Injectable()
export class NotificationsService {
  constructor(private readonly appConfigService: AppConfigService) {
    const serviceFirebase: ServiceAccount = {
      projectId: appConfigService.projectId,
      privateKey: appConfigService.privateKey,
      clientEmail: appConfigService.clientEmail,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceFirebase),
      databaseURL: appConfigService.firebaseUrl,
    });
  }

  async sendNotification(
    pushNotificationDto: PushNotificationDto,
  ): Promise<MessagingDevicesResponse> {
    const { deviceToken, title, message } = pushNotificationDto;
    const payload: MessagingPayload = {
      notification: {
        title: title,
        body: message,
      },
    };

    return admin.messaging().sendToDevice(deviceToken, payload);
  }
}
