import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class PushNotificationPickUpOrderDto {
  @ApiProperty()
  @IsString()
  orderId: string;
}
