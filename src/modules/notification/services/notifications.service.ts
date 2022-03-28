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
  MessageUpdateOrder,
  OrderStatus,
  OrderStatusNumber,
  TitleOrder,
} from 'src/modules/orders/constants/order.constant';
import { OrdersService } from 'src/modules/orders/services/orders.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Status } from 'src/modules/status/entities/status.entity';
import { User } from 'src/modules/users/entities/user.entity';
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

    admin.initializeApp(
      {
        credential: admin.credential.cert(serviceFirebase),
        databaseURL: appConfigService.firebaseUrl,
      },
      'notification',
    );
  }

  async sendNotificationRemindPickUpOrder(orderId: string) {
    const order = await this.ordersService.findById(orderId);
    if (!order) {
      throw new BadRequestException({ description: 'Invalid order' });
    }

    const user = await this.usersService.findUserById(order.user.toString());
    const webHook = user.webHook;
    const deviceToken = user.deviceToken;

    if (webHook) {
      const pushNotificationGoogleChat = {
        webHook: user.webHook,
        message: MessageRemindPickUpOrder,
      };

      await this.sendNotificationToGoogleChat(pushNotificationGoogleChat);
    }

    if (deviceToken.length) {
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
        status: OrderStatus.READY,
        image: product.images,
      };
      await this.sendNotificationFirebase(
        pushNotificationByFirebase,
        orderData,
      );
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

  async sendNotificationUpdateStatusOrder(
    order: Order,
    newStatus: Status,
    user: User,
  ) {
    const { name: nameNewStatus, value: valueNewStatus } = newStatus;

    if (
      user.deviceToken.length > 0 &&
      valueNewStatus === OrderStatusNumber.READY
    ) {
      const notification: PushNotificationDto = {
        deviceToken: user.deviceToken,
        title: TitleOrder,
        message: `${MessageUpdateOrder} ${nameNewStatus}`,
      };
      const orderData = {
        quantity: order.quantity.toString(),
        price: order.product.price.toString(),
        title: order.product.name,
        image: order.product.images,
        status: nameNewStatus,
      };
      await this.sendNotificationFirebase(notification, orderData);
    }

    if (user.webHook && valueNewStatus === OrderStatusNumber.READY) {
      const pushNotificationGoogleChatDto: PushNotificationGoogleChatDto = {
        webHook: user.webHook,
        message: `${MessageUpdateOrder} ${nameNewStatus}`,
      };
      await this.sendNotificationToGoogleChat(pushNotificationGoogleChatDto);
    }
  }
}
