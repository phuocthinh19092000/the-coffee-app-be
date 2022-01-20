import { Injectable, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppConfigService } from 'src/common/config/config.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OrdersService } from 'src/modules/orders/services/orders.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3333',
  },
})
@Injectable()
@UseGuards(JwtAuthGuard)
export class EventGateway {
  constructor(private readonly appConfigModule: AppConfigService) {}
  @WebSocketServer() server: Server;

  async sendToStaff(data: any) {
    console.log('data sendToStaff', data);
    this.server.sockets.to('roomForStaff2').emit('sendToStaff', data);
  }

  @SubscribeMessage('joinRoomStaff')
  handleJoinRoom(client: Socket, room: string) {
    console.log(client.id);
    console.log(room);
    client.join('roomForStaff2');
  }

  @SubscribeMessage('leaveRoomStaff')
  handleRoomLeave(client: Socket, room: string) {
    client.leave(room);
  }
}
