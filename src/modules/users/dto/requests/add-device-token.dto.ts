import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddDeviceTokenDto {
  @ApiProperty({ type: String })
  @IsString()
  deviceToken: string;
}
