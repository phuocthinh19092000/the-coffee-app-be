import { BadRequestException, Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderCreatedEvent } from 'src/modules/orders/events/order-created.event';

import {
  REACT_END_POINT,
  ROOM_FOR_STAFF,
  JOIN_ROOM_STAFF,
  LEAVE_ROOM_STAFF,
} from '../constants/event.constant';

@WebSocketGateway({
  cors: {
    origin: REACT_END_POINT,
  },
})
@Injectable()
export class OrderEventGateway {
  @WebSocketServer() server: Server;

  async sendToStaff(
    data: {
      order: OrderCreatedEvent;
      newOrderStatus?: string;
    },
    event: string,
  ) {
    this.server.sockets.to(ROOM_FOR_STAFF).emit(event, data);
  }

  @SubscribeMessage(JOIN_ROOM_STAFF)
  handleJoinRoom(client: Socket, room: string) {
    if (room === ROOM_FOR_STAFF) {
      client.join(room);
    } else throw new BadRequestException('Invalid room');
  }

  @SubscribeMessage(LEAVE_ROOM_STAFF)
  handleRoomLeave(client: Socket, room: string) {
    if (room === ROOM_FOR_STAFF) client.leave(room);
    else throw new BadRequestException('Invalid room');
  }
}
