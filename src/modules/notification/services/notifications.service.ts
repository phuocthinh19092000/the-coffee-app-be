import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import {
  MessagingDevicesResponse,
  MessagingPayload,
} from 'firebase-admin/lib/messaging/messaging-api';
import { lastValueFrom } from 'rxjs';
import { AppConfigService } from 'src/common/config/config.service';
import { PushNotificationDto } from '../dto/requests/push-notification-dto.dto';
import { PushNotificationGoogleChatDto } from '../dto/requests/push-notification-google-chat.dto';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class NotificationsService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private httpService: HttpService,
  ) {
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
    data?: { [key: string]: string },
  ): Promise<MessagingDevicesResponse> {
    const { deviceToken, title, message } = pushNotificationDto;
    const payload: MessagingPayload = {
      data: {
        title: title,
        body: message,
      },
    };

    if (data) {
      payload.data.data = JSON.stringify(data);
    }

    return admin.messaging().sendToDevice(deviceToken, payload);
  }
  async sendNotificationToGoogleChat(
    pushNotificationGoogleChatDto: PushNotificationGoogleChatDto,
  ): Promise<AxiosResponse> {
    const data = {
      text: pushNotificationGoogleChatDto.message,
    };

    const observableResponse = this.httpService.post(
      pushNotificationGoogleChatDto.webHook,
      data,
    );

    return lastValueFrom(observableResponse);
  }
}
