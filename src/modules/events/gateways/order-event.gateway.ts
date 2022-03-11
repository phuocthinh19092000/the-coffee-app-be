import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderCreatedEvent } from 'src/modules/orders/events/order-created.event';
import { UsersService } from 'src/modules/users/services/users.service';

import {
  REACT_END_POINT,
  ROOM_FOR_STAFF,
  JOIN_ROOM_STAFF,
  LEAVE_ROOM_STAFF,
  JOIN_ROOM_CUSTOMER,
  LEAVE_ROOM_CUSTOMER,
} from '../constants/event.constant';

@WebSocketGateway({
  cors: {
    origin: REACT_END_POINT,
  },
})
@Injectable()
export class OrderEventGateway {
  constructor(private readonly usersService: UsersService) {}
  @WebSocketServer() server: Server;

  sendToStaff(
    data: {
      order: OrderCreatedEvent;
      newOrderStatus?: string;
      currentOrderStatus?: string;
    },
    event: string,
  ) {
    this.server.sockets.to(ROOM_FOR_STAFF).emit(event, data);
  }

  sendToCustomer(order: OrderCreatedEvent, room: string, event: string) {
    this.server.sockets.to(room.toString()).emit(event, order);
  }

  @SubscribeMessage(JOIN_ROOM_STAFF)
  handleJoinRoomStaff(client: Socket, room: string) {
    if (room === ROOM_FOR_STAFF) {
      client.join(room);
    }
  }

  @SubscribeMessage(LEAVE_ROOM_STAFF)
  handleLeaveRoomStaff(client: Socket, room: string) {
    if (room === ROOM_FOR_STAFF) {
      client.leave(room);
    }
  }

  @SubscribeMessage(JOIN_ROOM_CUSTOMER)
  async handleJoinRoomCustomer(client: Socket, roomByUserId: string) {
    const user = await this.usersService.findUserById(roomByUserId);

    if (user) {
      client.join(roomByUserId);
    }
  }

  @SubscribeMessage(LEAVE_ROOM_CUSTOMER)
  handleRoomLeaveCustomer(client: Socket, roomByUserId: string) {
    client.leave(roomByUserId);
  }
}
