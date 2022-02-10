import { BadRequestException, Injectable } from '@nestjs/common';
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
import {
  MessageRemindPickUpOrder,
  OrderStatus,
  TitleOrder,
} from 'src/modules/orders/constants/order.constant';
import { OrdersService } from 'src/modules/orders/services/orders.service';
import { UsersService } from 'src/modules/users/services/users.service';
@Injectable()
export class NotificationsService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
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

  async sendNotificationRemindPickUpOrder(orderId: string) {
    const order = await this.ordersService.findById(orderId);
    if (!order) {
      throw new BadRequestException({ description: 'Invalid order' });
    }

    const user = await this.usersService.findUserById(order.userId.toString());
    const webHook = user.webHook;
    const deviceToken = user.deviceToken;

    if (webHook) {
      const pushNotificationGoogleChat = {
        webHook: user.webHook,
        message: MessageRemindPickUpOrder,
      };

      this.sendNotificationToGoogleChat(pushNotificationGoogleChat);
    }

    if (deviceToken) {
      const pushNotificationByFirebase = {
        deviceToken: user.deviceToken,
        title: TitleOrder,
        message: MessageRemindPickUpOrder,
      };

      const product = order.product;
      const orderData = {
        quantity: order.quantity.toString(),
        price: product.price.toString(),
        title: product.name,
        status: OrderStatus.ready,
      };

      this.sendNotificationFirebase(pushNotificationByFirebase, orderData);
    }
  }

  async sendNotificationFirebase(
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
