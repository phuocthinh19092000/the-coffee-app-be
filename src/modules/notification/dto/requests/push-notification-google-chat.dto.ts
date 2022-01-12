import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class PushNotificationGoogleChatDto {
  @ApiProperty()
  @IsString()
  webHook: string;

  @ApiProperty()
  @IsString()
  message: string;
}
