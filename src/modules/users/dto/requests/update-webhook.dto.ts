import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateWebhookDto {
  @ApiProperty()
  @IsString()
  webHook: string;
}
