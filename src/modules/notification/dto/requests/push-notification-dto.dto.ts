import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {} from 'firebase-admin/lib/messaging/messaging-api';

export class PushNotificationDto {
  @ApiProperty()
  @IsString()
  deviceToken: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  message: string;
}
