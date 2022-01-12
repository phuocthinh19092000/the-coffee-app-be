import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class LogoutDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  deviceToken: string;
}
