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
  SEND_TO_STAFF_EVENT,
} from '../constants/event.constant';

@WebSocketGateway({
  cors: {
    origin: REACT_END_POINT,
  },
})
@Injectable()
export class EventGateway {
  @WebSocketServer() server: Server;

  async sendToStaff(data: OrderCreatedEvent) {
    this.server.sockets.to(ROOM_FOR_STAFF).emit(SEND_TO_STAFF_EVENT, data);
  }

  @SubscribeMessage('joinRoomStaff')
  handleJoinRoom(client: Socket, room: string) {
    if (room === ROOM_FOR_STAFF) {
      client.join(room);
    } else throw new BadRequestException('Invalid room');
  }

  @SubscribeMessage('leaveRoomStaff')
  handleRoomLeave(client: Socket, room: string) {
    if (room === ROOM_FOR_STAFF) client.leave(room);
    else throw new BadRequestException('Invalid room');
  }
}
