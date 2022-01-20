import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OrderCreatedEvent } from 'src/modules/orders/events/order-created.event';
import { RoleType } from 'src/modules/roles/constants/role.constant';
import {
  ROOM_FOR_STAFF,
  SEND_TO_STAFF_EVENT,
} from '../constants/event.constant';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3333',
  },
})
@Injectable()
export class EventGateway {
  @WebSocketServer() server: Server;

  async sendToStaff(data: OrderCreatedEvent) {
    console.log('sendToStaff event', data);
    this.server.sockets.to(ROOM_FOR_STAFF).emit(SEND_TO_STAFF_EVENT, data);
  }

  @Roles(RoleType.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SubscribeMessage('joinRoomStaff')
  handleJoinRoom(client: Socket, room: string) {
    if (room === ROOM_FOR_STAFF) {
      console.log('join room');
      client.join(room);
    } else throw new BadRequestException('Invalid room');
  }

  @Roles(RoleType.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SubscribeMessage('leaveRoomStaff')
  handleRoomLeave(client: Socket, room: string) {
    if (room === ROOM_FOR_STAFF) client.leave(room);
    else throw new BadRequestException('Invalid room');
  }
}
